let React = require('react-native');

let {
    AppRegistry,
    StyleSheet,
    Text,
    WebView,
    View,
    TouchableHighlight,
    AlertIOS,
} = React;

let cheerio = require('cheerio');

class FetchTest extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = {
      response: 'Not Loaded',
    };
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  componentDidUpdate (prevProps) {
  }

    _onPressButtonGET () {
      this.setState({
        response: 'loading...',
      })
        fetch("http://marumaru.in/p/mobilemangamain", {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5"
          }
        })
        //fetch("http://marumaru.in/p/mobilemangamain", {method: "GET"})
        .then((response) => response.text())
        .then((responseData) => {
          //console.log(this.state.response);
          let titleReg = /<a href="(\/b\/manga\/.*?)"[\s\S]*?(?:data-original="(.*?)"[\s\S]*?)?<strong>(.*?)<\/strong>/g
          //let titleReg = /<div width="200"><strong>(.*)<\/strong><\/div>/g
          let matched = responseData.match(titleReg);
          let serieses = [];
          while ((matched = titleReg.exec(responseData)) !== null) {
            serieses.push({
              link: matched[1],
              thumbnail: matched[2],
              title: matched[3],
            });
          }
          console.log(serieses);
          this.setState({
            response: serieses.length + ' is loaded.',
          })
        })
        .catch((err) => {
          this.setState({
            response: err,
          })
        })
        .done();
    }

    _onPressButtonChapter () {
      this.setState({
        response: 'loading...',
      })
        fetch("http://marumaru.in/b/manga/102951", {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5"
          }
        })
        .then((response) => response.text())
        .then((responseData) => {
          var $ = cheerio.load(responseData);
          let content = $('#vContent');
          content.children('.snsbox').remove();
          content.children().last().remove();
          // FIXME: thumbnail.
          var image = content.find('img')[0];
          var thumbnail = image ? image.attribs['src'] : '';

          var ttt = {
            type: 'list',
            title: '[' + $("head meta[name=classification]").attr('content') + '] ' + $("head meta[name=subject]").attr('content'),
            data: [].map.call(content.find('a'), function (link) {
              return {
                //thumbnail: thumbnail,
                title: $(link).text().trim(),
                link: $(link).attr('href')
                  .replace('http://mangaumaru.com/', 'http://www.mangaumaru.com/')
                  .replace('http://www.mangaumaru.com/?p=', 'http://www.mangaumaru.com/archives/')
              }
            }).filter(function (episode) {
              return episode.title
                && episode.link.match(/http:\/\/www\.mangaumaru\.com\/archives\/\d+/);
            }).reverse()
          }
          //let contentReg = /<div id="vContent" class="content">([\s\S]*)<div class="tag">/
          //let titleReg = /<div width="200"><strong>(.*)<\/strong><\/div>/g
          //let matched = responseData.match(contentReg);
          //let content = matched[1] + '</div>';
          console.log(ttt);
          this.setState({
            response: JSON.stringify(ttt),
          })
        })
        .catch((err) => {
          this.setState({
            response: err.toString(),
          })
        })
        .done();
    }

    cookie: ''

    _onPressButtonPage () {
      let tried = 0;
      var fetchAndMakeCookie = function (url) {
        console.log("!!!!");
        fetch(url, {
          method: "POST",
          headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5",
            "Cookie": this.cookie,
          },
          credentials: 'include',
        })
        //fetch("http://www.mangaumaru.com/archives/519413", {method: "GET", body: JSON.stringify({username: "nraboy", firstname: "Nic", lastname: "Raboy"})})
          .then((response) => response.text())
          .then((responseData) => {
            //console.log(responseData);
            console.log('tried', tried++);
            if(tried < 0) {
              if (responseData.indexOf('<html><title>You are being redirected...</title>') === 0) {
                let script = responseData.match(/<script>(.+?)<\/script>/)[1];
                script = script.replace('e(r)', ';r');
                script = "function f() { var document = {}; var location = {reload: function() {}};" + eval(script) + "; return document.cookie; }; f()";
                this.cookie = eval(script);
                console.log('cookie', this.cookie);
                fetchAndMakeCookie(url)
                return;
              }
            }
            let article = responseData.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/);
            if (!article){
              // no article
              return;
            }
            article = article[1].replace(/<script>[\s\S]*?<\/script>/, '');
            console.log(article);
            let $ = cheerio.load(article);

            let attr = 'data-lazy-src';
            let list = $('img[' + attr + ']');

            let images = list.map(function () {
              return $(this).attr(attr);
            }).get();

            let ttt = {
              type: 'manga',
              title: $('.entry-title').text().trim(),
              images: images,
            };

            console.log(ttt);
            this.setState({
              response: JSON.stringify(ttt),
            })
          })
          .done();
      }.bind(this);
      fetchAndMakeCookie('http://www.mangaumaru.com/archives/192046');
      //fetchAndMakeCookie('http://www.mangaumaru.com/archives/519413');
    }

    _onPressButtonLogin () {
      fetch("http://www.mangaumaru.com/wp-login.php?action=postpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5",
          "Referer": "http://www.mangaumaru.com/archives/192046",
          "Cookie": this.cookie,
        },
        body: JSON.stringify({
          post_password: "qndxkr",
          Submit: "Submit",
        }),
        credentials: 'include',
      })
        //fetch("http://www.mangaumaru.com/archives/519413", {method: "GET", body: JSON.stringify({username: "nraboy", firstname: "Nic", lastname: "Raboy"})})
        .then((response) => response.headers)
        .then((headers) => {
          console.log(headers);
          this.setState({
            response: headers.get('set-cookie'),
          })
        })
        .done();
    }

    _onPressButtonLogin2 () {
      fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5",
          "Referer": "http://www.mangaumaru.com/wp-login.php?action=postpass",
          "Cookie": this.cookie,
        },
        body: JSON.stringify({
          post_password: "qndxkr1",
          Submit: "Submit",
        }),
        credentials: 'include',
      })
        //fetch("http://www.mangaumaru.com/archives/519413", {method: "GET", body: JSON.stringify({username: "nraboy", firstname: "Nic", lastname: "Raboy"})})
        .then((response) => response.headers)
        .then((headers) => {
          console.log(headers);
          this.setState({
            response: headers.get('set-cookie'),
          })
        })
        .done();
    }

    render () {
        return (
            <View style={styles.container}>
              <View style={styles.toolbarRow}>
                <TouchableHighlight onPress={this._onPressButtonGET.bind(this)} style={styles.button}>
                    <Text>Series</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={this._onPressButtonChapter.bind(this)} style={styles.button}>
                    <Text>Chapter</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={this._onPressButtonPage.bind(this)} style={styles.button}>
                    <Text>Page</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={this._onPressButtonLogin.bind(this)} style={styles.button}>
                    <Text>Login</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={this._onPressButtonLogin2.bind(this)} style={styles.button}>
                    <Text>2</Text>
                </TouchableHighlight>
              </View>
              <WebView style={styles.webView} html={this.state.response}>
              </WebView>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    toolbarRow: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 8,
    },
    button: {
        backgroundColor: '#eeeeee',
        padding: 10,
        marginRight: 5,
        marginLeft: 5,
    },
    webView: {
      height: 350,
    },
});

module.exports = FetchTest;
