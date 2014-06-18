(function(){
    var app = angular.module('manager', []);

    app.controller('ListController',  function($http){
        var myList = this;
        myList.videos = [];
        myList.news = [];
        myList.send = [];
        myList.enviado = false;

        $http.get("http://localhost:8080/api/tv/videos").success(function(data){
            //console.log(data);
            myList.videos = data;
            //console.log(myList.videos);
        });

        $http.get("http://localhost:8080/api/tv/news").success(function(data){
            //console.log(data);
            myList.news = data;
            //console.log(myList.news);
        });

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
                //console.log(JSON.parse(this.value).videoId);
                //console.log(this.value);
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
            $http.post('http://localhost:8080/api/dev/schedule', myList.send).success(function(){
                myList.enviado = true;
                myList.send = [];
            })
                .error(function(){
                    alert("error");
                });
        };
        myList.addC = addCenas;

    });

})();