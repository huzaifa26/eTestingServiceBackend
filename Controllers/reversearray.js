const a=['a','b','$','c','$','d','e'];

console.log("Array: "+a)
for(let i=0,j=a.length-1;i < a.length/2; i++,j--){
    if(a[j] !== "$" && a[i] !== "$"){
        let temp=a[i];
        a[i]=a[j];
        a[j]=temp;
    }
}

console.log("Reversed: "+ a);