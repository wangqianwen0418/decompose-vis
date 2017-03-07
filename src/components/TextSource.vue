<template>
    <div class="textSource">
          <p v-html = "exp">  <p>
    </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex';
// import { EDIT_EXP } from '../../store';

export default {
    computed: {
        exp: {
            get() {
                const selectedChannel = this.$store.getters.selectedChannel;
                return selectedChannel ? selectedChannel.explanation : '';
            },
            set(value) {
                this.$store.commit('EDIT_EXP', value);
            },
        },
    },
    // methods:{
    //     mapActions ({
    //         editExp: EDIT_EXP,
    //     })
    // },
};
</script>

<style>
.textSource{
    height: 23vh;
    background-color: var(--color-white);
    color:var(--color-blue-dark);
    margin:0vh 1vw 0vh 0.5vw;
    text-align: center
}
textarea{
    height:100%;
    width: 99.5%;
    background-color: var(--color-white);
    border: none;
    border-top: 2px solid var(--color-blue-gray);
    box-shadow: 2px 2px 1px var(--color-gray);

}
textarea:focus{
    outline:none;
}


</style>
