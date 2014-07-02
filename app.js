(function(){
    var app = angular.module('manager', []);

    app.controller('ListController', function($http, $scope){
        var myList = this;
        myList.videos = [];
        myList.news = [];
        myList.biblios = [];
        myList.broadcasts = [];
        myList.send = [];
        myList.enviado = false;

        $http.get("http://server.pi.campinhos.pt/api/tv/videos").success(function(data){
            myList.videos = data;
        });

        $http.get("http://server.pi.campinhos.pt/api/tv/news").success(function(data){
            myList.news = data;
        });

        $http.get("http://server.pi.campinhos.pt/api/tv/biblio").success(function(data){
            myList.biblios = data;
        });

        $http.get("http://server.pi.campinhos.pt/api/tv/broadcasts").success(function(data){
            myList.broadcasts = data;
        });

        $scope.removeBroadcast = function (broadcast) {
            var index = myList.broadcasts.indexOf(broadcast);
            console.log(index);
            if (index > -1) {
                myList.broadcasts.splice(index, 1);
            }
        }

        $scope.addBroadcast = function () {
            console.log("add");
            var type = $scope.type;
            var text = $scope.text;
            if(!type){
                alert("Tem que definir um tipo para o aviso.");
            }
            else{
                myList.broadcasts.push({
                    type: type,
                    text: text
                });
            }
        }

        var addCenas = function(){
            $("input:checkbox[name=video]:checked").each(function(){
                // add $(this).val() to your array
                var sendVideo={
                    type: 'video',
                    videoId: JSON.parse(this.value).videoId,
                    name: JSON.parse(this.value).name,
                    description: JSON.parse(this.value).description,
                    thumbnail: JSON.parse(this.value).thumbnail
                };
                myList.send.push(sendVideo);
            });

            $("input:checkbox[name=new]:checked").each(function(){
                // add $(this).val() to your array
                var sendNew={
                    type: 'new',
                    titulo: JSON.parse(this.value).titulo,
                    conteudo: JSON.parse(this.value).conteudo,
                    link: JSON.parse(this.value).link,
                    publicado: JSON.parse(this.value).publicado
                };
                myList.send.push(sendNew);
            });

            $("input:checkbox[name=biblio]:checked").each(function(){
                // add $(this).val() to your array
                var sendBiblio={
                    type: 'biblio',
                    titulo: JSON.parse(this.value).titulo,
                    descricao: JSON.parse(this.value).desc,
                    image: JSON.parse(this.value).image,
                    link: JSON.parse(this.value).link,
                    publicado: JSON.parse(this.value).publicado
                };
                myList.send.push(sendBiblio);
            });

            $http.post('http://server.pi.campinhos.pt/api/dev/schedule', myList.send).success(function(){
                myList.enviado = true;
                myList.send = [];
            })
                .error(function(){
                    alert("error");
                });

            $http.post('http://server.pi.campinhos.pt/api/dev/broadcast', myList.broadcasts).success(function(){
                console.log(myList.broadcasts);
            })
                .error(function(){
                    alert("error nos broadcasts");
                });
        };
        myList.addC = addCenas;

    });

})();