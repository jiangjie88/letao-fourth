$(function () {
    /* 如果两个初始化一样可以只写一个 */
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    }); 
    /* 1. 实现分类左侧的动态渲染
            1. 发送请求  请求左侧分类的数据 /category/queryTopCategory  和 localhost:3000/category/queryTopCategory 是一样的
            2. 拿到数据进行动态渲染
            3. 使用模板引擎来渲染左侧分类菜单 */

    //1.使用zepto的 $.ajax发送请求
    $.ajax({
        url:"/category/queryTopCategory",//根目录下的地址
        // datatype:'JSON',
        success:function(data){
            console.log(data);
            // 2. 调用模板引擎函数 传人模板id 和  对象的数据(data已经是对象了直接传人) 
              var html = template('categoryLeftTpl',data);
            console.log(html);
            $('.category-left ul').html(html);
        }
    });


    /* 2 实现分类左侧点击渲染右侧分类
        1.给所有左侧分类的li添加点击事件,事件委托
        2.拿id
        3.然后请求二级分类数据,把id当请求参数传递
        4.拿到二级分类数据,渲染右侧分类
        5.刚开始默认id为1,
        6.给当前单击a的父元素添加active        
    
    */
    //1.给所有左侧分类的li添加点击事件,事件委托
    $('.category-left ul').on('tap','li>a',function(){
        //  console.log($(this).data('id'));//拿了只会会做类型转换  
        //2.获取当前点击元素的id
        var id = $(this).data('id');
        //3获取右侧分类数据的函数
        querySecondCategory(id);
        //4添加active
        $(this).parent().addClass('active').siblings().removeClass('active');
               
    })
    querySecondCategory(1);
    // 定义一个专门获取右侧分类数据的函数
     function querySecondCategory(id){
         
        $.ajax({
            url:'/category/querySecondCategory',
            data:{id:id},
            success: function(data) {
                console.log(data);
                //4创建模板渲染数据
                
                var html =template('categoryRightTpl',data);
                //5把模板渲染到右侧分类的mui-row里面
                $('.category-right .mui-row').html(html);
            }
        })
     }
    
})