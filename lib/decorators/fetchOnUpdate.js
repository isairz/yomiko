import React, { PropTypes } from 'react'
import shallowEqualScalar from 'redux/lib/utils/shallowEqualScalar'

function mapParams (paramKeys, params, query) {
  query = query || []
  return paramKeys.reduce((acc, key) => {
    return Object.assign({}, acc, { [key]: (params[key] ) || query[key] })
  }, {})
}

export default function fetchOnUpdate (paramKeys, fn) {

  return DecoratedComponent =>
  class FetchOnUpdateDecorator extends React.Component {

    static propTypes = {
      actions: PropTypes.object.isRequired,
    }

    componentWillMount () {
      console.log(this.props.location.query)
      fn(mapParams(paramKeys, this.props.params, this.props.location.query), this.props.actions)
    }

    componentDidUpdate (prevProps) {
      const params = mapParams(paramKeys, this.props.params, this.props.location.query)
      const prevParams = mapParams(paramKeys, prevProps.params, prevProps.location.query)

      if (!shallowEqualScalar(params, prevParams))
        fn(params, this.props.actions)
    }

    render () {
      return (
        <DecoratedComponent {...this.props} />
      )
    }
  }
}
