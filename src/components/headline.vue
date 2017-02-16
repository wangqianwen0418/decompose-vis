<template>
    <div class="headline">
       <p id='name'> NarVis</p>
       <span class="iconGroup">
           <i class="icon el-icon-upload2"></i>
           <i class="icon el-icon-picture"></i>
       </span>
    </div>
</template>

<style scoped>
 /*.headline{
    height: 10vh;
    border-radius: 6px;
    font-size:40px;
    color:var(--color-0);
    background-color: var(--color-2);
  }
#name{
    margin: 0;
    margin-left: 30px;
    position: absolute;
    top: 50%;
    left: 0%;
    -ms-transform: translate(0%, -50%);
    transform: translate(0%, -50%);

}*/

/*version 2*/
 .headline{
    height: 10vh;
    /*border-radius: 6px;*/
    font-size:40px;
    color:var(--color-white);
    background-color: var(--color-blue);
    box-shadow: 1px 1px 0.5px var(--color-blue-dark);
    margin-bottom: 5px
    /*font-family: var(--font-4);*/
  }
#name{
    margin: 0;
    margin-left: 30px;
    position: absolute;
    top: 50%;
    left: 0%;
    -ms-transform: translate(0%, -50%);
    transform: translate(0%, -50%);
    font-family: var(--font-4);
}
.iconGroup{
    float: right;
    margin: 10px 15px;
    font-size: 30px;
}
.icon{
    padding: 0px 8px;
}

</style>
