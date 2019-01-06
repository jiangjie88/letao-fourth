$(function () {

    console.log(location);
    var key = getQueryString('key');
    console.log(key);
    queryProduct();
    /*  1. 根据url参数的值 去查询商品列表数据并显示 */

    /* 2. 在当前商品列表页面去搜索商品也能实现商品搜索 
           1. 获取搜索按钮添加点击事件
           2. 获取当前输入框输入要搜索的关键字
          3. 调用查询 传人当前用户输入的搜索关键字请求数据 渲染页面
    */
    $('.btn-search').on('tap', function () {
        //1获取输入内容
        key = $('.input-search').val().trim();
        //2非空判断
        if (!key) {
            mui.alert('请输入要搜索的关键字', '温馨提示', function () {

            });
            return;
        }
        //3 点击搜索按钮搜索商品 调用查询商品的渲染函数
        queryProduct();
         // 4. 下拉刷新完成后去重置上拉加载效果
         mui('#refreshContainer').pullRefresh().refresh(true);
         // 5. 除了重置上拉加载的效果 还要把page也重置为第一页 一定要重置page不然下一次请求到了很大page
         page = 1;

    })

    /* 3 商品的排序
        1. 点击了排序按钮进行商品的排序功能 给所有排序添加事件
        2. 排序规则是后端定义的  后端定义 price和 num排序
             如果price=1价格升序 从小到大 price=2 价格降序从 大到小 num也是和价格一样
        3. 点击排序按钮的时候 比如价格第一次点击进行升序排序 第二次进行降序排序 第三次 升序 第四就降序
        4. 调用api 传人除了之前名称 分页 还需要在加一个 排序方式=排序顺序 例如方式price=顺序是1
        5. 排序完后重新渲染页面
    */
    //1 给所有a添加点击事件
    $('.product-list .mui-card-header a').on('tap', function () {
        //2 获取排序的data-sort-type的属性
        var sortType = $(this).data('sort-type');
        console.log(sortType);
        // 3 获取当前a上的排序顺序
        var sort = $(this).data('sort');
        // console.log(sort);
        //4.在js中对排序进行修改,1变2,2变1
        sort = sort == 1 ? 2 : 1;
        console.log(sort);
        //5 把修改的排序保存
        $(this).data('sort', sort);
        //6在外面定义参数
        var obj = {
            proName: key,
            page: 1,
            pageSize: 4,
        }
        console.log(obj);
        //7判断排序项
        obj[sortType] = sort;
        console.log(obj);
        //8 不管价格和数量都是调用ajax请求 传人当前obj参数对象
        $.ajax({
            url: '/product/queryProduct',
            data: obj,
            success: function (res) {
                console.log(res);
                //调用模板
                var html = template('productListTpl', res);
                //渲染页面
                $('.product-list .mui-card-content .mui-row').html(html);
            }
        })
        //9添加active类
        $(this).addClass('active').siblings().removeClass('active');
        //给a里面的i替换类名
        if (sort == 1) {
            $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
        } else {
            $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
        }

         // 4. 下拉刷新完成后去重置上拉加载效果
         mui('#refreshContainer').pullRefresh().refresh(true);
         // 5. 除了重置上拉加载的效果 还要把page也重置为第一页 一定要重置page不然下一次请求到了很大page
         page = 1;

    })



    /*  4.商品下拉刷新和上拉加载更多 */
    // 1. 定义一个全局page默认为1 第一次默认的第一页
    var page = 1;

    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: { //初始化下拉

                callback: function () {
                    setTimeout(function () {
                        //重新渲染页面
                        queryProduct();
                        //结束下拉刷新
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        //下载刷新完成后,重置
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        page = 1;
                    }, 2000);
                }
            },

            up: { // 初始化上拉

                callback: function () {
                    setTimeout(function () {
                        //请求下一页数据
                        //把page全局变量++
                        page++;
                        $.ajax({
                            url: '/product/queryProduct',
                            data: {
                                proName: key,
                                page: page,
                                pageSize: 4
                            },
                            success: function (res) {
                                console.log(res);
                                // 3. 判断返回数据的数组的长度是否大于0 大于0表示有数据就追加渲染
                                if (res.data.length > 0) {
                                    // 4. 调用模板
                                    var html = template('productListTpl', res);
                                    // 5. 把列渲染追加到商品列表 的 mui-row里面 append函数
                                    $('.product-list .mui-card-content .mui-row').append(html);
                                    // 6. 数据加载完毕 要结束上拉加载 但是还有数据
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                                } else {
                                    // 7. 没有数据了 结束上拉加载 并且提示没有更多数据了
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }
                            }
                        });

                    }, 2000);
                }
            },
        }
    });



    //查询商品的函数
    function queryProduct() {
        $.ajax({
            url: '/product/queryProduct',
            data: {
                proName: key,
                page: 1,
                pageSize: 4,
            },
            success: function (res) {
                console.log(res);
                //调用模板
                var html = template('productListTpl', res);
                //把列渲染到商品列表中
                $('.product-list .mui-card-content .mui-row').html(html);
            }
        })
    }

    // 获取url参数值的函数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        // console.log(r); 
        if (r != null) return decodeURI(r[2]);
        return null;
    }

})

/* 
 //1. 在当前商品列表页面获取当前搜索的关键字和时间
 console.log(location.search);
 function getQueryString(name){
     var str = location.search
     //去掉?号
     str = str.substr(1);
     console.log(str);
     str =decodeURI(str);
     console.log(str);

     //把多个参数分开
     var arr =str.split('&');
     for(var i =0;i<arr.length; i++){
         var arr2 = arr[i].split('=');
         if(arr2[0] == name){
              // 返回 arr2数组的第二个值 就是参数的值
              return arr2[1];
         }
     }
 } */