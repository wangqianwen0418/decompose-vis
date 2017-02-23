<template>
    <div class="headline">
        <p id='name'> NarVis</p>

        <span class="iconGroup">
           <div style='float:right'>
           <i class="icon el-icon-picture" @click="showView = !showView"></i>
           <br/>preview
           </div>

           <div style='float:right' @click="showForm = !showForm" >
           <i class="icon el-icon-upload2"></i>
           <br/>import
           </div>
       </span>

       <el-dialog class='preview' v-model="showView" size='large' title='Preview'>
       </el-dialog>

        <el-dialog class='selectImport' v-model="showForm" size='tiny' title="Import">
            <el-upload
                class="upload-demo"
                action="//jsonplaceholder.typicode.com/posts/">
                <el-button size="small" :plain="true" type="info">upload a picture</el-button>
                only jpg/png less then 500kb
            </el-upload>
            <el-input
                type="textarea"
                :rows="6"
                :cols="40"
                placeholder="add the text description here"
                v-model="textDescription">
            </el-input>
            <el-button type="info" size="mini">import</el-button>
            <br/>   OR
            <br/>
            <el-select v-model="value" placeholder="choose an example">
                <el-option
                v-for="item in options"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                options: [{
                    value: '1',
                    label: 'case study 1',
                }, {
                    value: '2',
                    label: 'case study 2',
                }],
                showForm: false,
                showView: false,
                value: '',
                textDescription: '',
            };
        },
    };

</script>

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

    .headline {
        height: 10vh;
        /*border-radius: 6px;*/
        font-size: 40px;
        color: var(--color-white);
        background-color: var(--color-blue);
        box-shadow: 2px 2px 1px var(--color-gray);
        margin-bottom: 5px;
        font-family: var(--font-4);
    }

    #name {
        margin: 0;
        margin-left: 30px;
        position: absolute;
        top: 50%;
        left: 0%;
        -ms-transform: translate(0%, -50%);
        transform: translate(0%, -50%);
        font-family: var(--font-4);
    }

    .iconGroup {
        position: absolute;
        top: 50%;
        right: 0%;
        margin-right: 20px;
        -ms-transform: translate(0%, -50%);
        transform: translate(0%, -50%);
        font-size: 15px;
        font-family: var(--font-2);
    }

    .icon {
        padding: 0px 8px;
        font-size: 30px;
    }
    .selectImport{
        font-family: var(--font-2);
        font-size: 20px;
    }

    .preview{
        font-size: 20px;
    }

    el-button{
        margin: 10px;
    }




</style>
