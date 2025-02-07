document.oncontextmenu = function(){return false;}

/* 화면 */
var w = 1200;
var h = 540;

var temp = new Image();
temp.src = "./image/temp.png";


//로고
var logo = new Image();
logo.src = "./image/logo.png";

var fade_key = false;

//시작 버튼
var start_button = new Image();
start_button.src = "./image/start_button.png";

//타이틀
var title = new Image();
title.src = "./image/title.png";


/* 게임 진행 화면 */

//배경
var back = new Image();
back.src = "./image/background.png";
var ground = new Image();
ground.src = "./image/ground.png";


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
var basket_y = h/2 + 15;

var crash = 0; //충돌 판정
var basket_state = -1; //바구니 리셋 확인용
var basket_key = false; //바구니가 움직이고 있는지


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

var gameRunning = false;
var runGameInterval;
var gaugeInterval;
var walnutInterval;
var touch_key = false;

//이미지 로드 확인
var images = {}; 

var imageSources = {
    temp: "./image/temp.png",
    title: "./image/title.png",
    logo: "./image/logo.png",
    start_button: "./image/start_button.png",
    back: "./image/background.png",
    ground: "./image/ground.png",
    protractor: "./image/protractor.png",
    gauge: "./image/gauge.png",
    walnut: "./image/walnut.png",
    basket: "./image/basket.png",
    heart_on: "./image/heart/heart_on.png",
    heart_off: "./image/heart/heart_off.png",
    wind_event: "./image/wind_event.png",
    wind_event_reverse: "./image/wind_event_reverse.png"
};

function loadImages(callback) {
    imageCount = Object.keys(imageSources).length; // 전체 이미지 개수 설정
    loadedCount = 0

    for (let key in imageSources) {
        images[key] = new Image();
        images[key].src = imageSources[key];

        images[key].onload = function () {
            loadedCount++;

            // 모든 이미지 로드 시 콜백
            if (loadedCount === imageCount) {
                callback();
            }
        };

        images[key].onerror = function () {
            console.error(`이미지 로드 실패: ${imageSources[key]}`);
        };
    }
}

window.onload = function() {
    loadImages(loaded);
}


function loaded()
{
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

    resetWalnut();
    printLogo();
}

function resetGame() {  // 모든 변수 초기화
    clearInterval(runGameInterval);
    clearInterval(gaugeInterval);
    clearInterval(walnutInterval);
    
    score = 0;
    rand = Math.floor(Math.random() * 100);
    touch_key = false;
    heart_current = HEART;
    heart_array = Array.from({ length: HEART }, () => heart_on);
    resetWalnut();
    resetEvent();

    // 새로고침 시 게임을 초기화
    printMain();
}

function startGame()
{
    resetGame();
    document.getElementById("logo").removeEventListener("click", startGame);
    ctx_main.clearRect(0, 0, canvas.width, canvas.height);
    score = 0;

    //터치 이벤트 추가
    const touchDown = document.getElementById('logo');
    touchDown.addEventListener('touchstart', (event) => 
    {
        down();
    });
    const touchUp = document.getElementById('logo');
    touchDown.addEventListener('touchend', (event) => 
    {
        up();
    });

    //runGame 반복 호출
    runGameInterval = setInterval(runGame, 10); 
}

function fade_in()
{
    l = document.getElementById('logo');
    opacity = Number(window.getComputedStyle(l).getPropertyValue("opacity"));
    if(opacity < 1)
    {
        opacity = opacity+0.05;
        l.style.opacity = opacity;
    }
    else
    {
        fade_key = false;
        clearInterval(fade_inInterval);
    }
}

function fade_out()
{
    l = document.getElementById('logo');
    opacity = Number(window.getComputedStyle(l).getPropertyValue("opacity"));
    if(opacity > 0)
    {
        opacity = opacity-0.05;
        l.style.opacity = opacity;
    }
    else
    {
        fade_key = true;
        clearInterval(fade_outInterval);
    }
}

function printLogo()
{
    ctx_logo.drawImage(temp, 0, 0, w, h);
    ctx_logo.drawImage(logo, 400, 150, 400, 200);
    setTimeout(function() {fade_outInterval = setInterval(fade_out, 50)}, 1000);

    printMain();
}

function printMain()
{        
    context.drawImage(back, 0, 0, w, h);
    context.drawImage(logo, w - 220, 20, 200, 100);
    context.drawImage(ground, 0, 0 , w, h);
    context.drawImage(title, w/2 - 300, h/2 - 250 , 600, 300);
    ctx_main.drawImage(start_button, 550, h/2 + 100, 100, 100);
    gameRunning = true;
    document.getElementById("logo").addEventListener("click", startGame, {once: true});
}

function printEnd()
{
    ctx_main.clearRect(0, 0, w, h);
    context.clearRect(0, 0, w, h);

    ctx_main.drawImage(back, 0, 0, w, h);
    ctx_main.drawImage(logo, w - 220, 20, 200, 100);
    ctx_main.drawImage(ground, 0, 0 , w, h);
    ctx_main.drawImage(temp, w/4, h/4, w/2, h/2);


    const font = new FontFace('Jersey 10', 'url(https://fonts.googleapis.com/css2?family=Jersey+10&display=swap)');
    font.load().then(function()
    {
        ctx_main.font = "50px 'Jersey 10'";
        ctx_main.fillStyle = "white";
        ctx_main.fillText(score, w/2, h/2);
    }).catch(function(error) {
        console.error('Font Loading Failed: ', error);
    });

    WebFont.load({
    google: {
        families: ['Jersey+10'] //폰트 이름 확인
    },
    active: function() {
        ctx_main.font = "200px 'Jersey 10'";
        ctx_main.fillStyle = "white";
        ctx_main.fillText(score, w/2 - 200, h/2 + 50);
    }
    });

    document.getElementById("logo").addEventListener("click", startGame, {once: true});
}

function runGame()
{
    context.drawImage(back, 0, 0, w, h);
    context.drawImage(logo, w - 220, 20, 200, 100);
    context.drawImage(ground, 0, 0 , w, h);

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
    let x = 10;
    for(let i = 0 ; i < HEART ; i++)
    {
        context.drawImage(heart_array[i], x, 10, 80, 80);
        x += 85;
    }

    //각도기   
    ctx_pro.save(); 
    ctx_pro.clearRect(0, 0, canvas.width, canvas.height);
    ctx_pro.translate(160, h/2 + 150);
    if(!touch_key)
    {
        ctx_pro.rotate((slingshot_angle + 90)*(Math.PI / 180));
        ctx_pro.drawImage(protractor, -25, 0, 60, 128);
        ctx_pro.restore();
    }
    else
    {
        ctx_pro.rotate((slingshot_angle_current + 90)*(Math.PI / 180));
        ctx_pro.drawImage(protractor, -25, 0, 60, 128);
        ctx_pro.restore();

        ctx_pro.save(); 
        ctx_pro.translate(160, h/2 + 150);
        ctx_pro.rotate((slingshot_angle_current - 90)*(Math.PI / 180));
        ctx_pro.drawImage(gauge, -35, gauge_y, 60, 60);
        ctx_pro.restore();
    }

    context.drawImage(basket, basket_x, basket_y, 200, 200);
    context.drawImage(walnut, walnut_x, walnut_y, 100, 100);
    
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

function eventWind()
{
    event_key = true;
    //console.log("바람 이벤트 발생");

    if(rand%4 == 0)
    {
        //순방향
        wind = 30;
        context.drawImage(wind_event, w/2 - 200, h/2 - 100, 300, 300);
    }
    else
    {
        //역방향
        wind = -30;
        context.drawImage(wind_event_reverse, w/2 - 150, h/2 - 100, 300, 300);
    }
}

function eventBasket()
{
    event_key = true;
    //console.log("바구니 이벤트 발생");

    if(basket_key)
    {
        basket_x -= 2;
        if(basket_x < 700)
        {
            basket_key = false;
        }
    }
    else
    {
        basket_x += 2;
        if(900 < basket_x)
        {
            basket_key = true;
        }
    }
}

function resetEvent()
{
    event_key = false;

    basket_x = 700;
    basket_state = 0;
    wind = 0;
    count = 0;
    counter =0;
    rand = Math.floor(Math.random() * 100)
    //console.log(rand);
}

function resetWalnut()
{
    console.log("호두 리셋");
    walnut_x = 110;
    walnut_y = h/2 + 90;
    walnut_key = false;
}

function down()
{
    if(gameRunning && !touch_key && !walnut_key && !gaugeInterval) 
    {   
        console.log("down");
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
                    gauge_y -= 10;
                    if(slingshot_gauge >= MAXGAUGE)
                    {
                        slingshot_gauge_key = 1;
                        slingshot_gauge = MAXGAUGE;
                        gauge_y = MAXGAUGE * (-10) - 50;
                    }
                }
                else
                {
                    slingshot_gauge--;
                    gauge_y += 10;
                    if(slingshot_gauge < 0)
                    {
                        slingshot_gauge_key = 0;
                        slingshot_gauge = 1;
                        gauge_y = -50;
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
            if(basket_x-70 <= walnut_x && walnut_x <= basket_x+100 && basket_y - 10 <= walnut_y && walnut_y <= basket_y + 50)
            {
                touch_key = false;
                console.log("CRASH!");
                score += 20;
                clearInterval(walnutInterval);
                resetWalnut();
            }

            //바닥에 닿거나 화면을 벗어나면 정지
            else if((walnut_y > h-100 || walnut_x > w || walnut_x < 0) && walnut_key)
            {
                touch_key = false;
                console.log("FAIL...");
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
                    clearInterval(runGameInterval);
                    printEnd();
                }
                resetWalnut();
                clearInterval(walnutInterval);
            }
        }, 10);

    }
}