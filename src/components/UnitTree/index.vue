<template src='./template.html'></template>
<script src='./script.js'></script>

<style scoped>
.unitTree {
    margin: 1vh 0.5vw 1vh 1vw;
    height:40vh;
    box-shadow: 2px 2px 1px var(--color-gray);
    background-color: var(--color-white);
    font-family: 'Source Sans Pro';
}

#bTree{
    margin: 5px 10px;
    position:absolute;
    top: 30px;
    left:1vw;
}

.title{
    float:left;
    margin:1vw;
    color:var(--color-blue-dark);
    font-size:20px;
}

.changebutton {
    float:right;
    margin:1vw;
    color:var(--color-blue-dark);
    font-size:20px;
    background-color: #fafafa;
    outline:none;
    border: 2px solid var(--color-blue-light);
}

.changebutton span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.changebutton span:after {
  content: '\00bb';
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}

.changebutton:hover span {
  padding-right: 25px;
}

.changebutton:hover span:after {
  opacity: 1;
  right: 0;
}

.changetoggle {
    float:right;
    margin:1vw;
    font-size:20px;
    outline:none;
}

.vue-js-switch#changed-font {
  font-size: 15px;
}

hr {
     background: var(--color-blue-dark);
     width: 120%;
     height: 0.3vh;
     border:none;
     margin:0px;
     margin-left: -1vw;
}

</style>
