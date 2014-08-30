this["JST"] = this["JST"] || {};

this["JST"]["roomtype"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <option value=\"";
  if (stack1 = helpers.item) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.item; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.item) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.item; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</option>\n        ";
  return buffer;
  }

  buffer += "<img src=\"";
  if (stack1 = helpers.leadImage) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.leadImage; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\" />\n<h4>\n    ";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    <select class=\"searchahead-roomtypes\">\n        ";
  stack1 = helpers.each.call(depth0, depth0.numberOfRoomsArray, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </select>\n</h4>\n<p>";
  if (stack1 = helpers['abstract']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['abstract']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n";
  return buffer;
  });