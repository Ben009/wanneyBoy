import $ from 'jquery';

export default {
  name:"CertificateCommon",
  methods: {
      zsbhFormat(zsbh)
    {
      if (zsbh.length > 13) {
        zsbh = zsbh.substr(zsbh.length - 13);
      }
      return zsbh;
    },
    initCheckboxRadioSelect(obj){
      $("input[type='checkbox']", obj).each(function () {
        if (this.checked) {
          $(this).attr("checked", true);
        } else {
          $(this).removeAttr("checked");
        }
      });

      $("input[type='radio']", obj).each(function () {
        if (this.checked) {
          $(this).attr("checked",  true);
        } else {
          $(this).removeAttr("checked");
        }
      });

      $("select", obj).each(function () {
        if (this.checked) {
          $(this).attr("selected", true);
        } else {
          $(this).removeAttr("selected");
        }
      });
    },
  }
}
