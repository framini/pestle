this["JST"] = this["JST"] || {};

this["JST"]["lodge"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"searchahead-selectedlodges\">\n    <img src=\"";
  if (stack1 = helpers.leadImage) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.leadImage; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\" />\n    <h1>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n</div>\n";
  return buffer;
  });