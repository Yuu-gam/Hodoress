/* 변수 */

//화면
var w;
var h;
var scale;
var ratio = 20/9;

var temp = new Image();
temp.src = "./image/temp.png";


//배경
var back = new Image();
back.src = "./image/background.png";
var ground = new Image();
ground.src = "./image/ground.png";


//로고
var logo = new Image();
logo.src = "./image/logo.png";

var fade_key = false;


//타이틀
var title = new Image();
title.src = "./image/title.png";


//각도기
var protractor = new Image();
protractor.src = "./image/protractor.png";


//새총
var slingshot_angle = 90;
var slingshot_angle_key = 0; //MAX값 확인용
var slingshot_angle_current;
var ANGLESPEED = 0.5;


//장전 게이지
var gauge = new Image()
gauge.src = "./image/gauge.png";

var gauge_y;
var slingshot_gauge;
var MAXGAUGE = 10; //최대 게이지
var slingshot_gauge_key = 0; //MAX값 확인용


//호두
var walnut = new Image();
walnut.src = "./image/walnut.png";

var walnut_x;
var walnut_y;

var walnut_key = false; //호두가 움직이고 있는지


//바구니
var basket = new Image();
basket.src = "./image/basket.png";

var basket_x;
var basket_y;

var basket_state = -1; //바구니 리셋 확인용
var basket_key = false; //바구니가 움직이고 있는지

var success = new Image();
success.src = "./image/success.png"

var crash = false; //충돌 판정


//생명력
var heart_on = new Image();
heart_on.src = "./image/heart/heart_on.png";
var heart_off = new Image();
heart_off.src = "./image/heart/heart_off.png";

var HEART = 5; //최대 하트
var heart_current = HEART;
var heart_array = Array.from({length: HEART}, () => heart_on);


//이벤트
var count = 0;
var counter = 0;
var rand = Math.floor(Math.random() * 100);

var wind = 0;
var wind_event = new Image();
wind_event.src = "./image/wind_event.png";
var wind_event_reverse = new Image();
wind_event_reverse.src = "./image/wind_event_reverse.png";
var event_key = false; //이벤트가 진행중인지


//점수
var score = 0;

var score_panel = new Image();
score_panel.src = "./image/score_panel.png";

var gameRunning = false;
var gameEnding = false;
var runGameInterval;
var gaugeInterval;
var walnutInterval;
var touch_key = false;
var button_key = false;



/* 초기화 */
window.onload = function() {loaded();};

function loaded()
{
    window.addEventListener("resize", canvasResize);
    window.matchMedia("(orientation: portrait)").addEventListener("change", canvasResize);

    //진행화면
    canvas = document.getElementById('game');
    context = canvas.getContext('2d');

    //각도기
    canvas = document.getElementById('canvas_protractor');
    ctx_pro = canvas.getContext('2d');

    //메인화면
    canvas = document.getElementById('main');
    ctx_main = canvas.getContext('2d');

    //로고
    canvas = document.getElementById('logo');
    ctx_logo = canvas.getContext('2d');

    canvasResize();
    printLogo();
}

function canvasResize()
{
    w = window.innerWidth;
    h = w / ratio;
    scale = w/1200;

    //const startButton = document.getElementById('start_button');

    //캔버스 크기 설정
    let canvasList = ["game", "canvas_protractor", "main", "logo"];
    canvasList.forEach(id => {
        if(document.getElementById(id))
        {
            document.getElementById(id).width = w;
            document.getElementById(id).height = h;
            document.getElementById(id).getContext('2d').clearRect(0, 0, w, h);
        }
    });

    resetWalnut();
    resetEvent();

    if(!gameRunning && !gameEnding)
        printMain();
    else if (!gameRunning && gameEnding)
        printEnd();
}

function resetGame() 
{  
    clearInterval(runGameInterval);
    clearInterval(gaugeInterval);
    clearInterval(walnutInterval);
    
    score = 0;
    rand = Math.floor(Math.random() * 100);
    crash = false;
    touch_key = false;
    heart_current = HEART;
    heart_array = Array.from({ length: HEART }, () => heart_on);
    resetWalnut();
    resetEvent();

    // 재시작
    gameEnding = false;
    gameRunning = true;
}

function resetEvent()
{
    event_key = false;

    basket_x = 700 * scale;
    basket_y = (540 / 2 + 15) * scale;
    basket_state = 0;

    wind = 0;
    count = 0;
    counter = 0;
    rand = Math.floor(Math.random() * 100)
}

function resetWalnut()
{
    walnut_x = 110 * scale;
    walnut_y = (540 / 2 + 90) * scale;
    walnut_key = false;

    setTimeout(function() {crash = false;}, 500); //0.5초간 성공 출력
}



/* 게임 장면 */

function printLogo()
{
    const l = document.getElementById('logo');
    l.style.zIndex = '101';

    ctx_logo.drawImage(temp, 0, 0, w, h);
    ctx_logo.drawImage(logo, 400 * scale, 150 * scale, 400 * scale, 200 * scale);
    setTimeout(function() {fade_outInterval = setInterval(fade_out, 50)}, 1000);

    printMain();
}

function fade_out()
{
    const l = document.getElementById('logo');
    opacity = Number(window.getComputedStyle(l).getPropertyValue("opacity"));
    if(opacity > 0)
    {
        opacity = opacity-0.05;
        l.style.opacity = opacity;
    }
    else
    {
        l.style.zIndex = '99';
        clearInterval(fade_outInterval);
    }
}

function printMain()
{        
    context.drawImage(back, 0, 0, 1200 * scale, 540 * scale);
    context.drawImage(logo, (1200 - 220) * scale, 20 * scale, 200 * scale, 100 * scale);
    context.drawImage(ground, 0, 0 , 1200 * scale, 540 * scale);
    context.drawImage(title, (1200 / 2 - 300) * scale, (540 / 2 - 250) * scale , 600 * scale, 300 * scale);
    
    if(!button_key)
        printButton();
}

function printEnd()
{
    ctx_main.clearRect(0, 0, w, h);
    context.clearRect(0, 0, w, h);

    ctx_main.drawImage(back, 0, 0, w, h);
    ctx_main.drawImage(logo, w - 220, 20, 200, 100);
    ctx_main.drawImage(ground, 0, 0 , w, h);
    ctx_main.drawImage(score_panel, w/4, h/4 - 50, w/2, h/2);

    const font = new FontFace('Jersey 10', 'url(https://fonts.googleapis.com/css2?family=Jersey+10&display=swap)');
    WebFont.load({
        google: {
            families: ['Jersey+10'] //폰트 이름 확인
        },
        active: function() {
            ctx_main.font = "200px 'Jersey 10'";
            ctx_main.fillStyle = "white";
            ctx_main.textAlign = "center";
            ctx_main.fillText(score, (1200/2) * scale, (540/2) * scale);
        }
    });

    //재시작 버튼
    if(!button_key)
        printButton();
}



/* 시작 버튼 */

function printButton()
{
    button_key = true;

    const cast = document.getElementById('cast');
    cast.style.zIndex = '100';
    console.log(cast.offsetHeight)

    if(document.getElementById('start_button'))
    {
        console.log("이미 존재하는 start_button 삭제");
        removeButton();
    }
    else
    {
        console.log("start_button 출력");
        const startButton = document.createElement('start_button');
        canvasResize();

        startButton.id = "start_button";
        startButton.classList.add("start_button");
        startButton.innerHTML = '<img src="./image/start_button.png">';
        startButton.addEventListener('touchstart', handleClick);
        cast.appendChild(startButton);

        startButton.style.position = 'absolute';
        startButton.style.left = '50%';
        startButton.style.top = '70%';
        startButton.style.transform = 'translate(-50%, -50%)';
        startButton.style.width = '${200 * scale}px';
        startButton.style.height = '${100 * scale}px';
    }
}

function removeButton()
{
    button_key = false;

    const cast = document.getElementById('cast');
    cast.style.zIndex = '-1';

    const startButton = document.getElementById('start_button');
    if(startButton)
    {
        startButton.removeEventListener('touchstart', handleClick);
        startButton.remove();
        console.log('start_button 삭제');
    }
    else
    {
        console.log("삭제할 start_button 없음");
        printButton();
    }
}

function handleClick()
{
    //console.log("버튼 클릭");
    removeButton();
    resetGame();
    startGame();
}



/* 게임 진행 */

function startGame()
{
    document.getElementById("logo").removeEventListener("touchstart", handleClick);
    ctx_main.clearRect(0, 0, canvas.width, canvas.height);

    //터치 이벤트
    const touchDown = document.getElementById('logo');
    touchDown.removeEventListener('touchstart', down);
    touchDown.removeEventListener('touchend', up);
    touchDown.addEventListener('touchstart', down);
    touchDown.addEventListener('touchend', up);

    //반복 호출
    runGameInterval = setInterval(runGame, 10); 
}

function runGame()
{
    context.drawImage(back, 0, 0, w, h);
    context.drawImage(logo, (1200 - 220) * scale, 20 * scale, 200 * scale, 100 * scale);
    context.drawImage(ground, 0, 0 , w, h);

    if(crash) //성공 출력
    {
        context.drawImage(success, basket_x + 30 * scale, basket_y - 70 * scale, 150 * scale, 75 * scale);
    }

    if(!event_key)
    {
        count++;
    }
    
    if(200 < count) //2초마다
    {
        event_key = true;

        if(rand%2 == 0)
        {
            eventWind();
        }
        if(rand%3 == 0)
        {
            eventBasket();
        }

        counter++;

        if(500 < counter) //5초동안
        {
            resetEvent();
        }
    }

    if(walnut_x == null || walnut_y == null)
    {
        resetWalnut();
    }

    //체력 출력
    let x = 10 * scale;
    for(let i = 0 ; i < HEART ; i++)
    {
        context.drawImage(heart_array[i], x, 10 * scale, 80 * scale, 80 * scale);
        x += 85 * scale;
    }

    //각도기   
    ctx_pro.save(); 
    ctx_pro.clearRect(0, 0, canvas.width, canvas.height);
    ctx_pro.translate(160 * scale, (540/2 + 150) * scale);
    if(!touch_key)
    {
        ctx_pro.rotate((slingshot_angle + 90)*(Math.PI / 180));
        ctx_pro.drawImage(protractor, -25 * scale, 0, 60 * scale, 128 * scale);
        ctx_pro.restore();
    }
    else
    {
        ctx_pro.rotate((slingshot_angle_current + 90)*(Math.PI / 180));
        ctx_pro.drawImage(protractor, -25 * scale, 0, 60 * scale, 128 * scale);
        ctx_pro.restore();

        ctx_pro.save(); 
        ctx_pro.translate(160 * scale, (540/2 + 150) * scale);
        ctx_pro.rotate((slingshot_angle_current - 90)*(Math.PI / 180));
        ctx_pro.drawImage(gauge, -35 * scale, gauge_y, 60 * scale, 60 * scale);
        ctx_pro.restore();
    }

    context.drawImage(basket, basket_x, basket_y, 200 * scale, 200 * scale);
    context.drawImage(walnut, walnut_x, walnut_y, 100 * scale, 100 * scale);
    
    //각도 변화
    if(slingshot_angle_key == 0)
    {
        slingshot_angle -= ANGLESPEED;
        if(slingshot_angle <= 90)
        {
            slingshot_angle_key = 1;
            slingshot_angle = 90;
        }
    }
    else
    {
        slingshot_angle += ANGLESPEED;
        if(slingshot_angle >= 180)
        {
            slingshot_angle_key = 0;
            slingshot_angle = 180;
        }
    }
}



/* 이벤트 */

function eventWind()
{
    event_key = true;
    //console.log("바람 이벤트 발생");

    if(rand%4 == 0)
    {
        //순방향
        wind = 30;
        context.drawImage(wind_event, (1200/2 - 400) * scale, (540/2 - 250) * scale, 500 * scale, 500 * scale);
    }
    else
    {
        //역방향
        wind = -30;
        context.drawImage(wind_event_reverse, (1200/2 - 350) * scale, (540/2 - 250) * scale, 500 * scale, 500 * scale);
    }
}

function eventBasket()
{
    event_key = true;
    //console.log("바구니 이벤트 발생");

    if(basket_key)
    {
        basket_x -= 2 * scale;
        if(basket_x < 700 * scale)
        {
            basket_key = false;
        }
    }
    else
    {
        basket_x += 2 * scale;
        if(900 * scale < basket_x)
        {
            basket_key = true;
        }
    }
}


/* 터치 인식 */

function down()
{
    if(gameRunning && !touch_key && !walnut_key && !gaugeInterval) 
    {   
        //console.log("down");
        touch_key = true;
        slingshot_gauge = 1;
        slingshot_angle_current = slingshot_angle;
        gauge_y = -50   

        //게이지
        if(!gaugeInterval)
        {
            gaugeInterval = setInterval(function(){
                if(slingshot_gauge_key == 0)
                {
                    slingshot_gauge++;
                    gauge_y -= 10 * scale;
                    if(slingshot_gauge >= MAXGAUGE)
                    {
                        slingshot_gauge_key = 1;
                        slingshot_gauge = MAXGAUGE;
                        gauge_y = (MAXGAUGE * (-10) - 50) * scale;
                    }
                }
                else
                {
                    slingshot_gauge--;
                    gauge_y += 10 * scale;
                    if(slingshot_gauge < 0)
                    {
                        slingshot_gauge_key = 0;
                        slingshot_gauge = 1;
                        gauge_y = -50 * scale;
                        //console.log('min')
                    }
                }
            }, 100);
        }
    }
}


function up()
{
    if(gameRunning && touch_key && !walnut_key)
    {
        slingshot_angle = 90;
        walnut_key = true;
        clearInterval(gaugeInterval);
        gaugeInterval = null;

        let x = walnut_x, y = walnut_y, t = 0;
        let v = 10 + slingshot_gauge*10 + wind;
        let g = 8;
        let angle = slingshot_angle_current * (Math.PI / 180); //라디안으로 변환

        walnutInterval = setInterval(function(){
            t += 0.3; //속도 조절
            walnut_x = x - v*Math.cos(angle)*t;
            walnut_y = y - (v*Math.sin(angle) - (1/2*g*t))*t;

            //충돌 판정
            if(basket_x-80 <= walnut_x && walnut_x <= basket_x+120 && basket_y - 15 <= walnut_y && walnut_y <= basket_y + 50)
            {
                touch_key = false;
                //console.log("CRASH!");
                crash = true;
                score += 20;
                clearInterval(walnutInterval);
                resetWalnut();
            }

            //바닥에 닿거나 화면을 벗어나면 정지
            else if((walnut_y > h-100 || walnut_x > w || walnut_x < 0) && walnut_key)
            {
                touch_key = false;
                //console.log("FAIL...");
                score -= 5;

                if(heart_current > 0)
                {
                    heart_array[heart_current-1] = heart_off;
                    heart_current--;
                }
        
                //체력이 0이되면 엔딩화면 출력
                if(heart_current <= 0)
                {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    gameRunning = false;
                    gameEnding = true;
                    clearInterval(runGameInterval);
                    printEnd();
                }
                resetWalnut();
                clearInterval(walnutInterval);
            }
        }, 10);

    }
}