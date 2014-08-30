this["JST"] = this["JST"] || {};

this["JST"]["lodge"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "<span class=\"searchahead-removeitem\">X</span>";
  }

function program3(depth0,data) {
  
  
  return "\n<div class=\"searchahead-roomtypes\">\n    <em>Loading..</em>\n</div>\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.closebutton, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<img src=\"";
  if (stack1 = helpers.leadImage) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.leadImage; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\" />\n<h1>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n<a href=\"";
  if (stack1 = helpers.path) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.path; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">More about this lodge</a>\n\n";
  stack1 = helpers['if'].call(depth0, depth0.single, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });