import{G as N,j as e,L as C,m as S,n as b,r as d,d as y,o as m,p as E,q as g,t as j,_ as f,f as q,v as R}from"./index-43G1P5X5.js";function $(t){return N({tag:"svg",attr:{viewBox:"0 0 16 16",fill:"currentColor"},child:[{tag:"path",attr:{fillRule:"evenodd",clipRule:"evenodd",d:"M8.6 1c1.6.1 3.1.9 4.2 2 1.3 1.4 2 3.1 2 5.1 0 1.6-.6 3.1-1.6 4.4-1 1.2-2.4 2.1-4 2.4-1.6.3-3.2.1-4.6-.7-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1zm.5 12.9c1.3-.3 2.5-1 3.4-2.1.8-1.1 1.3-2.4 1.2-3.8 0-1.6-.6-3.2-1.7-4.3-1-1-2.2-1.6-3.6-1.7-1.3-.1-2.7.2-3.8 1-1.1.8-1.9 1.9-2.3 3.3-.4 1.3-.4 2.7.2 4 .6 1.3 1.5 2.3 2.7 3 1.2.7 2.6.9 3.9.6zM7.9 7.5L10.3 5l.7.7-2.4 2.5 2.4 2.5-.7.7-2.4-2.5-2.4 2.5-.7-.7 2.4-2.5-2.4-2.5.7-.7 2.4 2.5z"},child:[]}]})(t)}const z=({cartItem:t,addToCartHandler:u,removeFromCartHandler:a})=>{const{productId:r,photos:i,name:o,price:n,quantity:l}=t;return console.log(r,i,o,n,l),e.jsxs("div",{className:"cart-item",children:[e.jsx(C,{to:`/product/${r}`,children:e.jsx("img",{src:i[0],alt:o})}),e.jsxs("article",{children:[e.jsx(C,{to:`/product/${r}`,children:o}),e.jsxs("span",{children:["₹",n]})]}),e.jsxs("div",{children:[e.jsx("button",{onClick:()=>a(t),children:"-"}),e.jsx("p",{children:l}),e.jsx("button",{onClick:()=>u(t),children:"+"})]}),e.jsx("button",{onClick:()=>a({...t,quantity:0}),children:e.jsx(S,{})})]})},V=()=>{const{cartItems:t,subtotal:u,tax:a,total:r,shippingCharges:i,discount:o}=b(s=>s.cartReducer),[n,l]=d.useState(""),[v,h]=d.useState(!0),c=y();d.useEffect(()=>{const{token:s,cancel:p}=m.CancelToken.source(),I=setTimeout(()=>{n&&m.get(`${E}/api/v1/payment/discount?coupon=${n}`,{cancelToken:s}).then(x=>{c(g(x.data.discount)),h(!0),c(j())}).catch(x=>{h(!1),c(g(0)),c(j()),f.error(x.response.data.message||"server error")})},1e3);return()=>{p(),clearTimeout(I),h(!1)}},[n]);const k=s=>{if(s.quantity>=s.stock){f.error("Out of Stock");return}c(q(s))},T=s=>{c(R(s))};return d.useEffect(()=>{c(j())},[t,c]),e.jsxs("div",{className:"cart",children:[e.jsx("main",{children:t.length>0?t.map((s,p)=>(console.log("🥳",s),e.jsx(z,{cartItem:s,removeFromCartHandler:T,addToCartHandler:k},p))):e.jsx("h1",{children:"No Items Added"})}),e.jsxs("aside",{children:[e.jsxs("p",{children:["Subtotatal:₹",u," "]}),e.jsxs("p",{children:["Shipping Charges:₹",i," "]}),e.jsxs("p",{children:["Tax:₹",a," "]}),e.jsxs("p",{children:["discount:",e.jsx("em",{className:o<=0?"":"red",children:o<=0?"₹0":"-₹"+o})]}),e.jsxs("p",{children:["total:₹",r]}),e.jsx("input",{type:"text",placeholder:"Coupon Code",value:n,onChange:s=>l(s.target.value)}),n&&(v?e.jsxs("span",{className:"green",children:["₹",o," off using the code: ",e.jsx("code",{children:n})," "]}):e.jsxs("span",{className:"red",children:["Invalid coupon ",e.jsx($,{})]})),t.length>0&&e.jsx(C,{to:"/shipping",children:"Checkout"})]})]})};export{V as default};
