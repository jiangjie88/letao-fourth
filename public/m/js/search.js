$(function(){
    /* 1.添加搜索记录
    1.获取当前输入的内容
    2.需要把内容存储到数组中,然后再将数组存储到本地存储中
    3.判断 去除重复的 如果之前有数组中存在这个值 要先删除 再添加
    4.把数组存储到本地存储中时, 要把数组转成一个json字符串,再存进去
    5.调用本地存储的函数,把json字符串存储到本地存储中
        */

    //1).给搜索框按钮添加点击事件
    $('.btn-search').on('tap',function(){
        console.log(this);
        //2).获取当前输入框输入的内容,去除空格
        var search =$('.input-search').val().trim();
        console.log(search);
        //3).进行非空判断
        if(search == ''){
            mui.toast('你没有输入内容,请输入');
            return;
        }
        /* 4).把数据存储到一个数组中
        1.有可能不是第一次添加,就在之前的值上累加
        2.先获取之前的数组,获取之前historyData里面的数组 */
        var arr =localStorage.getItem('historyData');
        //5).把数组字符串转换成js数组,也可能为空
        arr = JSON.parse(arr) || [];
        //6). 数组去重
        //判断当前值是否存在在数组中
        if(arr.indexOf(search) != -1){
            arr.splice(arr.indexOf(search),1);      
           
        }
        //8.去除后添加新数组
        arr.unshift(search);
        //9加完之后,存储到本地
        arr = JSON.stringify(arr);
        localStorage.setItem('historyData',arr);
        //10输入完成后,清空文本框
        $('.input-search').val('');
        //11添加完成后,重新查询
        queryHistory();
        //12也可以默认不写,就是默认为encodeURI
        location = 'productlist.html?key='+search+'&time='+new Date().getTime();
    })
    queryHistory();
    // 由于每次添加了都需要查询 把查询的代码放到一个函数queryHistory里面 第一次调用一下 在添加完成也调用一下
    function queryHistory(){
        var arr =localStorage.getItem('historyData');
        arr = JSON.parse(arr) || [];
        console.log(arr);

        var html = template('searchHistoryTpl',{rows : arr});
        $('.search-history ul').html(html);
    }
    

    //清除历史记录
    //事件委托
    $('.search-history').on('tap','.btn-delete',function(){
        
        var index =$(this).data('index');
        //读取本地存储
        var arr =localStorage.getItem('historyData');
        //转换
        // arr = JSON.parse(arr) || [];   
        arr = JSON.parse(arr || '[]') ; //空字符串, 空数组会报错
        arr.splice(index,1);
        //保存数据
        arr = JSON.stringify(arr);
        localStorage.setItem('historyData',arr);
        //删除后.重新渲染
        queryHistory();

    })

    //清空记录
    $('.btn-clear').on('tap',function(){
        localStorage.removeItem('historyData');
        // localStorage.clear();
        //重新渲染页面
        queryHistory();
    })
})