# simple-gallery-js
Simplery - gallery javascript

### How to use
JavaScript:
```
<head>
  //...
   <script src="main.js"></script>
   <script>
		 const gallery = new Simplery({
		  container: '#gallery-container',  // required
		  itemsPerRow: 6,                   // optional, default: 4
		  space: 10,                        // optional, default: 0
		  itemWidth: 320                    // optional, default: 320px
	   });
   </script>
</head>
```

HTML:
```
<div id="gallery-container">
  <a class="gallery-item" href="#">
    <img src="images/1.jpg">
	</a>
  ... more items
</div>
```
Gallery item must have class ".gallery-item"
