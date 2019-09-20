PC (Desktop) version only.  
PC (데스크톱) 버전만 해당.

<br><br><br><br><br>  

![]( https://befzz.github.io/wkgml/header_fixed2.png  )

### 1. Find and... (찾기 및...)
```css
#article-list #article-list-category {
    border-top: 2px solid #8c8a8d;
    background: #FFF;
}
```
### replace:  ( 및 교체: )
```css
#article-list #article-list-category {
    border-top: 2px solid #8c8a8d;
    background: #FFF;
    display: flex;
}

#article-list #article-list-category>a {
    background: #FFF;
    flex: auto;
    padding: 11px 11px;
    text-align: center;
}

div#article-list-category>a:first-child {
    border-bottom: 3px solid #5e83a1;
}

#article-list #article-list-category> a.nav-link.active {
    background-color: #f9f9f9 !important;
}

#article-list #article-list-category>a:hover {
    background-color: #f9f9f9;
}
```

<br><br><br><br><br><br><br><br> <br>   

![](https://befzz.github.io/wkgml/header_fixed_hider.png)

### 2. Add... (덧붙이다...)
```css

#article-list #article-option-area {
    position: absolute;
    right: 9px;
    top: 47px;
    z-index: 20;
}

#article-list #article-option-area>#article-option-area-toggle-btn {
    background: none;
}
```
 <br><br><br><br><br><br><br><br> <br>   


![](https://befzz.github.io/wkgml/wkgml_imgl.gif)


### 3. Add... (덧붙이다...)
```css
img#board-info-profile-img:hover{
    cursor: none;
    animation: 0.35s 2 ease-in-out 0.6s alternate colorrot;
}

@keyframes colorrot{
    0.00%{
      filter:saturate(100%);
    }
 
    20.00%{
      filter:saturate(300%);
      transform: translateY(-1px) rotateY(-5deg)  rotateX(-5deg) ;
    }

    40.00%{
      filter:saturate(0%);
      transform: rotateZ(1deg) ;
    }

    75.00%{
      filter:saturate(300%);
      transform: translateY(-2px) rotateY(-9deg)  rotateX(-10deg) ;
    }
    100.00%{
      filter:saturate(100%);
    }
}


```

### 442 =^^=
