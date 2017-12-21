var initPageSpeed = 40,
        initFontSize = 60,
        scrollDelay,
        textColor = '#ffffff',
        backgroundColor = '#141414',
        timer = $('.clock').timer({stopVal: 10000});


$(".teleprompter").on('paste', function (e) {
//    clipboard.setData('text/plain', clipboard.getData('text/plain'));
    setTimeout(function () {
        $('article .teleprompter span').each(function () {
            $(this).removeAttr('style');
        });
        $('article .teleprompter p').each(function () {
            $(this).removeAttr('style');            
        });
            var txt = $("article .teleprompter").html();
            var html = txt.replace(/<{1}[^<>]{1,}>{1}/g," ");
            $("article .teleprompter").html("<p>"+html+"</p>");
        
        
    },100);
    // $(this).css({"font-family":"'HelveticaNeue-Light', 'HelveticaNeue', Helvetica, Arial, sans-serif","font-size":"60px","font-weight":"bold"});
    fontSize(true);
})

$(function () {

    edit_mode_off();

    if (navigator.userAgent.match(/Android/i))
    {
        $('article').addClass('android')
        $('body').addClass('android')
    }
    if (navigator.userAgent.match(/iPhone/i))
    {
        $('article').addClass('iphone')
        $('body').addClass('iphone')
    }
    // Check if we've been here before and made changes
    if ($.cookie('teleprompter_font_size'))
    {
        initFontSize = $.cookie('teleprompter_font_size');
    }
    if ($.cookie('teleprompter_speed'))
    {
        initPageSpeed = $.cookie('teleprompter_speed');
    }
    if ($.cookie('teleprompter_text'))
    {
        $('#teleprompter').html($.cookie('teleprompter_text'));
    }
    if ($.cookie('teleprompter_text_color'))
    {
        textColor = $.cookie('teleprompter_text_color');
        $('#text-color').val(textColor);
        $('#text-color-picker').css('background-color', textColor);
        $('#teleprompter').css('color', textColor);
    }
    if ($.cookie('teleprompter_background_color'))
    {
        backgroundColor = $.cookie('teleprompter_background_color');
        $('#background-color').val(backgroundColor);
        $('#background-color-picker').css('background-color', textColor);
        $('#teleprompter').css('background-color', backgroundColor);
    } else
    {
        clean_teleprompter();
    }

    // Listen for Key Presses
    $('#teleprompter').keyup(update_teleprompter);
    $('body').keydown(navigate);

    // Setup GUI
    $('article').stop().animate({scrollTop: 0}, 100, 'linear', function () {
        $('article').clearQueue();
    });
    //$('.marker, .overlay').fadeOut(0);
    $('article .teleprompter').css({
        'padding-bottom': Math.ceil($(window).height() - $('header').height()) + 'px'
    });

    // Create Font Size Slider
    $('.font_size').slider({
        min: 50,
        max: 130,
        value: initFontSize,
        orientation: "horizontal",
        range: "min",
        animate: true,
        slide: function () {
            fontSize(true);
        },
        change: function () {
            fontSize(true);
        }
    });

    // Create Speed Slider
    $('.speed').slider({
        min: 0,
        max: 50,
        value: initPageSpeed,
        orientation: "horizontal",
        range: "min",
        animate: true,
        slide: function () {
            speed(true);
        },
        change: function () {
            speed(true);
        }
    });

    $('#text-color').change(function () {
        var color = $(this).val();
        $('#teleprompter').css('color', color);
        $.cookie('teleprompter_text_color', color);
    });
    $('#background-color').change(function () {
        var color = $(this).val();
        $('#teleprompter').css('background-color', color);
        $.cookie('teleprompter_background_color', color);
    });

    // Run initial configuration on sliders
    fontSize(false);
    speed(false);
    // Listen for remote_on Button Click
    $('.button.remote_on').click(function () {
        if ($(this).hasClass('icon-gamepada'))
        {
            $(this).removeClass('icon-gamepada');
            $('#teleprompter').attr('contenteditable', true);
            stop_teleprompter();
            document.body.addEventListener("keypress", function (e) {
                return true;
            });

        } else
        {

            $(this).addClass('icon-gamepada');

            edit_mode_off();

        }

    });
    $('.button.icon-folder-open').click(function () {
        var r = confirm("Supported format .txt The selected text replaces the current text.");
        if (r) {
            $("input[name='iamge']").click();
        }
    })
    $(".modal-header .close").click(function () {
        $('#myDiv').hide();
    });
    // Listen for Play Button Click
    $('.button.play').click(function () {
        if ($(this).hasClass('icon-play'))
        {
            start_teleprompter();

        } else
        {
            stop_teleprompter();
        }
    });
    // Listen for avanceRapido Button Click
    $('.button.avanceRapido').click(function () {
        if ($(this).hasClass('icon-forward'))
        {
            start_teleprompter_avanceRapido();
            stop_teleprompter();
        } else
        {
            stop_teleprompter();
        }
    });
    // Listen for revRapido Button Click
    $('.button.revRapido').click(function () {
        if ($(this).hasClass('icon-backward'))
        {
            start_teleprompter_revRapido();
            stop_teleprompter();

        } else
        {

            stop_teleprompter();
        }
    });
    // Listen for FlipX Button Click
    $('.button.flipx').click(function () {
//
//    timer.resetTimer();
//
//    	if($('.teleprompter').hasClass('flipy'))
//		{
//			$('.teleprompter').removeClass('flipy').toggleClass('flipxy');
//		}
//		else
//		{
        $('.teleprompter').toggleClass('flipx');

        $('.clock').toggleClass('flipx-clock');
        $('.controler-player').toggleClass('nav-flipx');
        $('.small').toggleClass('button-flipy');
        if ($('#teleprompter').hasClass('flipx'))
            $(".icon-play.marker").addClass('activate');
        else
            $(".icon-play.marker").removeClass('activate');

//		}
    });
    // Listen for FlipY Button Click
//	$('.button.flipy').click(function(){
//
//    timer.resetTimer();
//		if($('.teleprompter').hasClass('flipx'))
//		{
//			$('.teleprompter').removeClass('flipx').toggleClass('flipxy');
//		}
//		else
//		{
//			$('.teleprompter').toggleClass('flipy');
//		}
//		if ($('.teleprompter').hasClass('flipy')) {
//      $('article').stop().animate({scrollTop: $(".teleprompter").height() + 100 }, 250, 'swing', function(){ $('article').clearQueue(); });
//		} else {
//      $('article').stop().animate({scrollTop: 0 }, 250, 'swing', function(){ $('article').clearQueue(); });
//		}
//	});
    // Listen for Reset Button Click
    $('.button.reset').click(function () {
        stop_teleprompter();
        timer.resetTimer();
        $('article').stop().animate({scrollTop: 0}, 100, 'linear', function () {
            $('article').clearQueue();
        });
    });
});

//Edit Pencil mode

function edit_mode_off() {
    $("#teleprompter").attr("contenteditable", false);

}
$("#teleprompter").on('focus', function (e) {
    if ($(".button.remote_on").hasClass('icon-gamepada')) {
        e.preventDefault();
        e.stopPropagation();
    }
});
// Manage Font Size Change
function fontSize(save_cookie)
{


    initFontSize = $('.font_size').slider("value");

    $('article .teleprompter').css({
        'font-size': initFontSize + 'px',
        'line-height': Math.ceil(initFontSize * 1.5) + 'px',
        'padding-bottom': Math.ceil($(window).height() - $('header').height()) + 'px'
    });

    $('article .teleprompter p').css({
        'padding-bottom': Math.ceil(initFontSize * 0.25) + 'px',
        'margin-bottom': Math.ceil(initFontSize * 0.25) + 'px'
    });

    $('label.font_size_label span').text('(' + initFontSize + ')');

    if (save_cookie)
    {
        $.cookie('teleprompter_font_size', initFontSize);
    }

}

// Manage Speed Change
function speed(save_cookie)
{
    initPageSpeed = Math.floor(50 - $('.speed').slider('value'));
    $('label.speed_label span').text('(' + $('.speed').slider('value') + ')');

    if (save_cookie)
    {
        $.cookie('teleprompter_speed', $('.speed').slider('value'));
    }
}

// Manage avance rápido Teleprompter
function avanceRapido()
{
    if ($('.teleprompter').hasClass('flipy')) {
        $('article').animate({scrollTop: "-=500px"}, 500, 'linear', function () {
            $('article').clearQueue();
        });

        clearTimeout(scrollDelay);
        scrollDelay = setTimeout(pageScroll, initPageSpeed);

        // We're at the bottom of the document, stop
        if ($("article").scrollTop() === 0)
        {
            stop_teleprompter();
            setTimeout(function () {
                $('article').stop().animate({scrollTop: $(".teleprompter").height() + 100}, 500, 'swing', function () {
                    $('article').clearQueue();
                });
            }, 500);
        }
    } else {
        $('article').animate({scrollTop: "+=500px"}, 500, 'linear', function () {
            $('article').clearQueue();
        });

        clearTimeout(scrollDelay);
        scrollDelay = setTimeout(pageScroll, initPageSpeed);

        // We're at the bottom of the document, stop
        if ($("article").scrollTop() >= (($("article")[0].scrollHeight - $(window).height()) - 100))
        {
            stop_teleprompter();
            setTimeout(function () {
                $('article').stop().animate({scrollTop: 0}, 500, 'swing', function () {
                    $('article').clearQueue();
                });
            }, 500);
        }
    }
}

// Manage revobinado rápido Teleprompter
function revRapido()
{
    if ($('.teleprompter').hasClass('flipy')) {
        $('article').animate({scrollTop: "+=500px"}, 500, 'linear', function () {
            $('article').clearQueue();
        });

        clearTimeout(scrollDelay);
        scrollDelay = setTimeout(pageScroll, initPageSpeed);

        // We're at the bottom of the document, stop
        if ($("article").scrollTop() === 0)
        {
            stop_teleprompter();
            setTimeout(function () {
                $('article').stop().animate({scrollTop: $(".teleprompter").height() + 100}, 500, 'swing', function () {
                    $('article').clearQueue();
                });
            }, 500);
        }
    } else {
        $('article').animate({scrollTop: "-=500px"}, 500, 'linear', function () {
            $('article').clearQueue();
        });

        clearTimeout(scrollDelay);
        scrollDelay = setTimeout(pageScroll, initPageSpeed);

        // We're at the bottom of the document, stop
        if ($("article").scrollTop() >= (($("article")[0].scrollHeight - $(window).height()) - 100))
        {
            stop_teleprompter();
            setTimeout(function () {
                $('article').stop().animate({scrollTop: 0}, 500, 'swing', function () {
                    $('article').clearQueue();
                });
            }, 500);
        }
    }
}

// Manage remote ON
function remote_on()
{
//	shortcut.add("u", function() {
//			start_teleprompter();
//			setTimeout(function(){ document.activeElement.blur();  }, 100);//espera 1/10 segundos y luego quita el foco del campo de texto del teleprompter para que funcione el mando			
//	        },{
//		  'type':'keydown',
//		  //'disable_in_input':true,
//		  //'propagate':false,
//		  //'target':document	
//			});			
    //alert("1. Close this bubble\n2. Press PLAY (B) BUTTON in the Remote to activate it");
    document.getElementById("teleprompter").focus();
    $('#teleprompter').attr('contenteditable', false);
    //evita que introduzca texto
//	function alertDismissed() {
//	document.getElementById("teleprompter").focus();
//	document.body.addEventListener("keypress", function(e) {e.preventDefault();});//evita que introduzca texto
//}
//
//navigator.notification.alert(
//    '1. Close this bubble.\n2. Press PLAY (B) BUTTON in the Remote to activate it.',  // message
//    alertDismissed,         // callback
//    'Please power your remote on (if not yet) an then...',            // title
//    'Done'                  // buttonName
//);


}


// Manage Scrolling Teleprompter
function pageScroll()
{
    if ($('.teleprompter').hasClass('flipy')) {
        $('article').animate({scrollTop: "-=1px"}, 0, 'linear', function () {
            $('article').clearQueue();
        });

        clearTimeout(scrollDelay);
        scrollDelay = setTimeout(pageScroll, initPageSpeed);

        // We're at the bottom of the document, stop
        if ($("article").scrollTop() === 0)
        {
            stop_teleprompter();
            setTimeout(function () {
                $('article').stop().animate({scrollTop: $(".teleprompter").height() + 100}, 500, 'swing', function () {
                    $('article').clearQueue();
                });
            }, 500);
        }
    } else {
        $('article').animate({scrollTop: "+=1px"}, 0, 'linear', function () {
            $('article').clearQueue();
        });

        clearTimeout(scrollDelay);
        scrollDelay = setTimeout(pageScroll, initPageSpeed);

        // We're at the bottom of the document, stop
        if ($("article").scrollTop() >= (($("article")[0].scrollHeight - $(window).height()) - 100))
        {
            stop_teleprompter();
            setTimeout(function () {
                $('article').stop().animate({scrollTop: 0}, 500, 'swing', function () {
                    $('article').clearQueue();
                });
            }, 500);
        }
    }
}



// Listen for Key Presses on Body for iOS (ONLY WORKS IF THE FOCUS IS IN THE TEXT)
function navigate(evt)
{
    var
            space = 40, //teclado cursor abajo - play
            space = 68, //d - play
            escape = 65, //a - reset, volver al principio
            left = 72, //h - velocidad menos
            up = 89, //y - tamaño texto más
            right = 74, //j - velocidad más
            down = 85, //u - tamaño texto menos
            avanza = 87, //w	- salto hacia delante
            retrocede = 88, //x - salto hacia atrás
            remote_on = 79, //l - foco en teleprompter para remote
            speed = $('.speed').slider('value'),
            font_size = $('.font_size').slider('value')
            ;
    // Exit if we're inside an input field
    if (typeof evt.target.id == 'undefined' || evt.target.id == 'teleprompter')
    {
        return;
    } else if (typeof evt.target.id == 'undefined' || evt.target.id != 'gui')
    {
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    }
    // remote_on
//	else if(evt.keyCode == remote_on)
//	{
//		$('.button.avanceRapido').trigger('click');
//		evt.preventDefault();
//		evt.stopPropagation();
//		return false;
//	}	
    // Avanza GUI
    else if (evt.keyCode == avanza)
    {
        $('.button.avanceRapido').trigger('click');
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    }
    // Retrocede GUI
    else if (evt.keyCode == retrocede)
    {
        $('.button.revRapido').trigger('click');
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    }
    // Reset GUI
    else if (evt.keyCode == escape)
    {
        $('.button.reset').trigger('click');
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    }
    // Start Stop Scrolling
    else if (evt.keyCode == space)
    {
        $('.button.play').trigger('click');
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    }

    // Decrease Speed with Left Arrow
    else if (evt.keyCode == left)
    {
        $('.speed').slider('value', speed - 1);
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    }
    // Decrease Font Size with Down Arrow
    else if (evt.keyCode == down)
    {
        $('.font_size').slider('value', font_size - 1);
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    }
    // Increase Font Size with Up Arrow
    else if (evt.keyCode == up)
    {
        $('.font_size').slider('value', font_size + 1);
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    }
    // Increase Speed with Right Arrow
    else if (evt.keyCode == right)
    {
        $('.speed').slider('value', speed + 1);
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    }
}

// Start Teleprompter
function start_teleprompter()
{
    $('#teleprompter').attr('contenteditable', false);
    $('body').addClass('playing');
    $('.button.play').removeClass('icon-play').addClass('icon-pause');
    $('header h1, header nav').fadeTo('slow', 0.15);
    //$('.marker, .overlay').fadeIn('slow');
    setTimeout(function () {
        document.activeElement.blur();
    }, 100);//espera 1/10 segundos y luego quita el foco del campo de texto del teleprompter para que funcione el mando
    window.timer.startTimer();

    pageScroll();
}

// Start Teleprompter_avanceRapido
function start_teleprompter_avanceRapido()
{
    $('#teleprompter').attr('contenteditable', false);
    $('body').addClass('playing');
    $('.button.play').removeClass('icon-play').addClass('icon-pause');
    //$('header h1, header nav').fadeTo('slow', 0.15);
    //$('.marker, .overlay').fadeIn('slow');

    //window.timer.startTimer();

    avanceRapido();
}

// Start Teleprompter_revRapido
function start_teleprompter_revRapido()
{
    $('#teleprompter').attr('contenteditable', false);

    $('body').addClass('playing');
    $('.button.play').removeClass('icon-play').addClass('icon-pause');
    //$('header h1, header nav').fadeTo('slow', 0.15);
    //$('.marker, .overlay').fadeIn('slow');

    //window.timer.startTimer();

    revRapido();
}

// Remote on [foco en el texto del teleprompter]
function start_remote_on()
{
    //alert("hola");
    //$('#teleprompter').attr('contenteditable', true);

    $('body').addClass('playing');
    $('.button.play').removeClass('icon-play').addClass('icon-pause');
    //$('header h1, header nav').fadeTo('slow', 0.15);
    //$('.marker, .overlay').fadeIn('slow');

    //window.timer.startTimer();

    remote_on();
}

// Stop Teleprompter
function stop_teleprompter()
{
    clearTimeout(scrollDelay);
    //$('#teleprompter').attr('contenteditable', true);

    $('header h1, header nav').fadeTo('slow', 1);
    $('.button.play').removeClass('icon-pause').addClass('icon-play');
    //$('.marker, .overlay').fadeOut('slow');
    $('body').removeClass('playing');

    window.timer.stopTimer();
}

// Update Teleprompter
function update_teleprompter()
{
    $.cookie('teleprompter_text', $('#teleprompter').html());
}

// Clean Teleprompter
function clean_teleprompter()
{
    var text = $('#teleprompter').html();
    text = text.replace(/<br>+/g, '@@').replace(/@@@@/g, '</p><p>');
    text = text.replace(/@@/g, '<br>');
    text = text.replace(/([a-z])\. ([A-Z])/g, '$1.&nbsp;&nbsp; $2');
    text = text.replace(/<p><\/p>/g, '');

    if (text.substr(0, 3) !== '<p>')
    {
        text = '<p>' + text + '</p>';
    }

    $('#teleprompter').html(text);
}

/*
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function (b) {
    b.support.touch = "ontouchend" in document;
    if (!b.support.touch) {
        return;
    }
    var c = b.ui.mouse.prototype, e = c._mouseInit, a;
    function d(g, h) {
        if (g.originalEvent.touches.length > 1) {
            return;
        }
        g.preventDefault();
        var i = g.originalEvent.changedTouches[0], f = document.createEvent("MouseEvents");
        f.initMouseEvent(h, true, true, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, false, false, false, false, 0, null);
        g.target.dispatchEvent(f);
    }
    c._touchStart = function (g) {
        var f = this;
        if (a || !f._mouseCapture(g.originalEvent.changedTouches[0])) {
            return;
        }
        a = true;
        f._touchMoved = false;
        d(g, "mouseover");
        d(g, "mousemove");
        d(g, "mousedown");
    };
    c._touchMove = function (f) {
        if (!a) {
            return;
        }
        this._touchMoved = true;
        d(f, "mousemove");
    };
    c._touchEnd = function (f) {
        if (!a) {
            return;
        }
        d(f, "mouseup");
        d(f, "mouseout");
        if (!this._touchMoved) {
            d(f, "click");
        }
        a = false;
    };
    c._mouseInit = function () {
        var f = this;
        f.element.bind("touchstart", b.proxy(f, "_touchStart")).bind("touchmove", b.proxy(f, "_touchMove")).bind("touchend", b.proxy(f, "_touchEnd"));
        e.call(f);
    };
})(jQuery);
