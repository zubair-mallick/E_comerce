import{n as x,Y as f,r as t,Z as g,_ as h,j as s,m as j,O as H}from"./index-43G1P5X5.js";import{A as b}from"./AdminSidebar-BUv8Ptgd.js";import{T as A}from"./TableHOC-Do7jel3_.js";import{r as E}from"./features-BjRR1Pe-.js";import"./index-D4DqmvuM.js";import"./index-5qdCXePn.js";const R=[{Header:"Avatar",accessor:"avatar"},{Header:"Name",accessor:"name"},{Header:"Gender",accessor:"gender"},{Header:"Email",accessor:"email"},{Header:"Role",accessor:"role"},{Header:"Action",accessor:"action"}],w=()=>{const{user:r}=x(e=>e.userReducer),{isLoading:n,data:a,isError:c,error:d}=f(r==null?void 0:r._id),[o,l]=t.useState([]),[m]=g(),i=async e=>{const p=await m({userId:e,adminUserId:r==null?void 0:r._id});E(p,null,"")};if(c){const e=d;h.error(e.data.message)}t.useEffect(()=>{a&&l(a.users.map(e=>(console.log(e.photo),{avatar:s.jsx("img",{style:{borderRadius:"50%"},src:e.photo,alt:e.name}),name:e.name,email:e.email,gender:e.gender,role:e.role,action:s.jsx("button",{onClick:()=>i(e._id),children:s.jsx(j,{})})})))},[a]);const u=A(R,o,"dashboard-product-box","Customers",o.length>6)();return s.jsxs("div",{className:"admin-container",children:[s.jsx(b,{}),s.jsx("main",{children:n?s.jsx(H,{length:20}):u})]})};export{w as default};
