$('#login-button').click(function (event) {
	var userName=document.getElementById("userName").value;
    var pwd=document.getElementById("pwd").value;
		//修改密码请改此处
    if(userName=="123" &&  pwd=="123"){
			event.preventDefault();
			$('form').fadeOut(500);
			$('.wrapper').addClass('form-success');
			// setTimeout(function(){location.href="BirthdayCake.html";},2000);
			showMemories();
			$('#login').remove();
		}
	else{
		alert("Wrong Password");
	}
});

function showMemories(){
	var audio = $('.song')[0];
	audio.play();

	$('#memories-wrapper').show();
}