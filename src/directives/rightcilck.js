export default {
  inserted: function (el, binding) {
    el.oncontextmenu=function(event){

      if(event.target.tagName==='INPUT' || event.target.tagName==='TEXTAREA'){
        event.preventDefault();
        binding.value(event);
      }
    }
  }
}
