exports.id=509,exports.ids=[509],exports.modules={3947:(e,t,r)=>{"use strict";r.d(t,{Toaster:()=>T});var s=r(45512),o=r(58009);let n=0,i=new Map,a=e=>{if(i.has(e))return;let t=setTimeout(()=>{i.delete(e),u({type:"REMOVE_TOAST",toastId:e})},1e6);i.set(e,t)},d=(e,t)=>{switch(t.type){case"ADD_TOAST":return{...e,toasts:[t.toast,...e.toasts].slice(0,1)};case"UPDATE_TOAST":return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case"DISMISS_TOAST":{let{toastId:r}=t;return r?a(r):e.toasts.forEach(e=>{a(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,open:!1}:e)}}case"REMOVE_TOAST":if(void 0===t.toastId)return{...e,toasts:[]};return{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)}}},l=[],c={toasts:[]};function u(e){c=d(c,e),l.forEach(e=>{e(c)})}function m({...e}){let t=(n=(n+1)%Number.MAX_VALUE).toString(),r=()=>u({type:"DISMISS_TOAST",toastId:t});return u({type:"ADD_TOAST",toast:{...e,id:t,open:!0,onOpenChange:e=>{e||r()}}}),{id:t,dismiss:r,update:e=>u({type:"UPDATE_TOAST",toast:{...e,id:t}})}}var f=r(80627),p=r(21643),v=r(44269),h=r(59462);let b=f.Kq,g=o.forwardRef(({className:e,...t},r)=>(0,s.jsx)(f.LM,{ref:r,className:(0,h.cn)("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",e),...t}));g.displayName=f.LM.displayName;let x=(0,p.F)("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",{variants:{variant:{default:"border bg-background text-foreground",destructive:"destructive group border-destructive bg-destructive text-destructive-foreground"}},defaultVariants:{variant:"default"}}),y=o.forwardRef(({className:e,variant:t,...r},o)=>(0,s.jsx)(f.bL,{ref:o,className:(0,h.cn)(x({variant:t}),e),...r}));y.displayName=f.bL.displayName,o.forwardRef(({className:e,...t},r)=>(0,s.jsx)(f.rc,{ref:r,className:(0,h.cn)("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",e),...t})).displayName=f.rc.displayName;let w=o.forwardRef(({className:e,...t},r)=>(0,s.jsx)(f.bm,{ref:r,className:(0,h.cn)("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",e),"toast-close":"",...t,children:(0,s.jsx)(v.A,{className:"h-4 w-4"})}));w.displayName=f.bm.displayName;let j=o.forwardRef(({className:e,...t},r)=>(0,s.jsx)(f.hE,{ref:r,className:(0,h.cn)("text-sm font-semibold",e),...t}));j.displayName=f.hE.displayName;let N=o.forwardRef(({className:e,...t},r)=>(0,s.jsx)(f.VY,{ref:r,className:(0,h.cn)("text-sm opacity-90",e),...t}));function T(){let{toasts:e}=function(){let[e,t]=o.useState(c);return o.useEffect(()=>(l.push(t),()=>{let e=l.indexOf(t);e>-1&&l.splice(e,1)}),[e]),{...e,toast:m,dismiss:e=>u({type:"DISMISS_TOAST",toastId:e})}}();return(0,s.jsxs)(b,{children:[e.map(function({id:e,title:t,description:r,action:o,...n}){return(0,s.jsxs)(y,{...n,children:[(0,s.jsxs)("div",{className:"grid gap-1",children:[t&&(0,s.jsx)(j,{children:t}),r&&(0,s.jsx)(N,{children:r})]}),o,(0,s.jsx)(w,{})]},e)}),(0,s.jsx)(g,{})]})}N.displayName=f.VY.displayName},8128:(e,t,r)=>{Promise.resolve().then(r.bind(r,17913)),Promise.resolve().then(r.bind(r,70677))},9473:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,13219,23)),Promise.resolve().then(r.t.bind(r,34863,23)),Promise.resolve().then(r.t.bind(r,25155,23)),Promise.resolve().then(r.t.bind(r,40802,23)),Promise.resolve().then(r.t.bind(r,9350,23)),Promise.resolve().then(r.t.bind(r,48530,23)),Promise.resolve().then(r.t.bind(r,81601,23)),Promise.resolve().then(r.t.bind(r,88921,23))},17913:(e,t,r)=>{"use strict";r.d(t,{ThemeProvider:()=>s});let s=(0,r(46760).registerClientReference)(function(){throw Error("Attempted to call ThemeProvider() from the server but ThemeProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"C:\\Users\\edvin\\Downloads\\project-bolt-sb1-9wvhppmr (1)\\project\\components\\theme-provider.tsx","ThemeProvider")},19611:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>l,metadata:()=>d});var s=r(62740);r(82704);var o=r(61421),n=r.n(o),i=r(17913),a=r(70677);let d={title:"BrandAI - Personal Brand Manager",description:"AI-powered personal brand management platform"};function l({children:e}){return(0,s.jsx)("html",{lang:"en",suppressHydrationWarning:!0,children:(0,s.jsx)("body",{className:n().className,children:(0,s.jsxs)(i.ThemeProvider,{attribute:"class",defaultTheme:"light",children:[e,(0,s.jsx)(a.Toaster,{})]})})})}},45921:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,66959,23)),Promise.resolve().then(r.t.bind(r,33875,23)),Promise.resolve().then(r.t.bind(r,88903,23)),Promise.resolve().then(r.t.bind(r,57174,23)),Promise.resolve().then(r.t.bind(r,84178,23)),Promise.resolve().then(r.t.bind(r,87190,23)),Promise.resolve().then(r.t.bind(r,48429,23)),Promise.resolve().then(r.t.bind(r,61365,23))},59462:(e,t,r)=>{"use strict";r.d(t,{cn:()=>n});var s=r(82281),o=r(94805);function n(...e){return(0,o.QP)((0,s.$)(e))}},61129:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>d});var s=r(62740),o=r(59607),n=r.n(o),i=r(95840),a=r(70447);function d(){return(0,s.jsx)("div",{className:"flex min-h-screen items-center justify-center",children:(0,s.jsxs)("div",{className:"max-w-md text-center",children:[(0,s.jsx)("h1",{className:"text-9xl font-bold text-primary",children:"404"}),(0,s.jsx)("h2",{className:"mt-4 text-2xl font-semibold",children:"Sidan kunde inte hittas"}),(0,s.jsx)("p",{className:"mt-2 text-muted-foreground",children:"Tyv\xe4rr kunde vi inte hitta sidan du letar efter."}),(0,s.jsx)("div",{className:"mt-8",children:(0,s.jsx)(n(),{href:"/",children:(0,s.jsxs)(a.$,{className:"bg-primary hover:bg-primary/90 text-white",children:[(0,s.jsx)(i.A,{className:"mr-2 h-4 w-4"})," Tillbaka till startsidan"]})})})]})})}},70447:(e,t,r)=>{"use strict";r.d(t,{$:()=>c});var s=r(62740),o=r(76301),n=r(15225),i=r(67699),a=r(13673),d=r(47317);let l=(0,i.F)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),c=o.forwardRef(({className:e,variant:t,size:r,asChild:o=!1,...i},c)=>{let u=o?n.DX:"button";return(0,s.jsx)(u,{className:function(...e){return(0,d.QP)((0,a.$)(e))}(l({variant:t,size:r,className:e})),ref:c,...i})});c.displayName="Button"},70677:(e,t,r)=>{"use strict";r.d(t,{Toaster:()=>s});let s=(0,r(46760).registerClientReference)(function(){throw Error("Attempted to call Toaster() from the server but Toaster is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"C:\\Users\\edvin\\Downloads\\project-bolt-sb1-9wvhppmr (1)\\project\\components\\ui\\toaster.tsx","Toaster")},71680:(e,t,r)=>{Promise.resolve().then(r.bind(r,72789)),Promise.resolve().then(r.bind(r,3947))},72789:(e,t,r)=>{"use strict";r.d(t,{ThemeProvider:()=>n});var s=r(45512);r(58009);var o=r(3371);function n({children:e,...t}){return(0,s.jsx)(o.N,{...t,children:e})}},80820:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,59607,23))},82704:()=>{},87021:(e,t,r)=>{"use strict";r.d(t,{$:()=>l});var s=r(45512),o=r(58009),n=r(12705),i=r(21643),a=r(59462);let d=(0,i.F)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),l=o.forwardRef(({className:e,variant:t,size:r,asChild:o=!1,...i},l)=>{let c=o?n.DX:"button";return(0,s.jsx)(c,{className:(0,a.cn)(d({variant:t,size:r,className:e})),ref:l,...i})});l.displayName="Button"},99380:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,28531,23))}};