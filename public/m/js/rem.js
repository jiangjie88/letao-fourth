setHtmlFontSize();
function setHtmlFontSize() {
    //假设设计稿大小
    var designWidth = 750;
    //假设设计稿根元素大小
    var designFontSize = 200;
    //获取当前屏幕宽度
    var windowWidth = document.documentElement.offsetWidth;
    //计算当前屏幕大小
    var nowFontSize = windowWidth / (designWidth / designFontSize);
    //设置到当前html元素的font-size上
    document.documentElement.style.fontSize = nowFontSize + 'px';

}

//添加一个屏幕宽度变化事件,屏幕自适应
window.addEventListener('resize',setHtmlFontSize);

