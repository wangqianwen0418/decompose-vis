<template>
    <div class="headline">
        <p id='name'> NarVis</p>

        <span class="iconGroup">
           <div style='float:right'>
           <i class="icon el-icon-picture" ></i>
           <br/>preview
           </div>

           <div style='float:right' @click="showForm = !showForm" >
           <i class="icon el-icon-upload2"></i>
           <br/>import
           </div>

             <div class='selectImport'  v-if='showForm' >
             <input type="file" class="upload" />
             <br/>OR
             <br/>
            <select placeholder="pls select an example">
                <option v-for='option in options' value="option.label">{{option.label}}</option>
                <option ></option>
            </select>
             </div>

            <!--<el-upload
                class="upload-demo"
                action="//jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList">
                <el-button size="small" type="primary">click to upload</el-button>
            </el-upload>-->
       </span>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                options: [{
                    label: 'choose an example',
                }, {
                    label: 'case study 1',
                }, {
                    label: 'case study 2',
                }, {
                    label: 'upload your own file',
                }],
                showForm: false,
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
        box-shadow: 2px 2px 1px var(--color-blue-dark);
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

    .selectImport {
        position: absolute;
        top: 0%;
        right: 20%;

    }
    select:focus {
        outline:none;
    }
</style>
