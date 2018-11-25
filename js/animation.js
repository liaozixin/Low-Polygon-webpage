$(function(){
	var music = document.getElementById("bg-song");
	$("#music").click(function(){
		if(music.paused){
			music.play();
			$("#music").removeClass("pause").addClass("play");
			$("i").css({'animation':'playMusic 1.2s infinite','color':'#00BDEA'});
		}
		else{
			music.pause();
			$("#music").removeClass("play").addClass("pause");
			$("i").css({'animation':'playMusic 0s infinite','color':'#A020F0'});
		}
	});
});

