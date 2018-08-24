<template>
    <div>
        <span v-html="htmlContent"></span>
    </div>
</template>
<script>
export default {
    name:'queryInsForm',
    props:{
        htmlContent:{
            required:false,
        }
    },
    data(){
        return {

        }
    },
    methods:{

    }

}
</script>

