# Visualization graph decomposing algorithm
### decomposing a visualization graph into basic elements
### axis + link + bar + node + text + flow + simple geometry = visualization graph


## 1. Color spaces segmentation.
#### Split the original color space(hsl) into numerous sub-spaces.
A typical visualization graph usually includes 3-5 mainly colors.
The color of each pixel would not be fairly distributed in the color space,
also even for the same color, they have difference of lumen and saturation. 
For a bitmap with millions of pixels, 
there are lots of points in the color space.
Our algorithm helps us divide the color space into disjoint parts.


#### Algorithm1 (done)

Consider a simple one-dimensional segmentation, we use dynamic programing to help use minimum the variance of all segments.
We first split the 1st dimension using the above algorithm, then split the 2nd dimension recursively, finally split the 3rd dimension.


#### Algorithm2 (not yet implemented)
```
p = 0.001
threshold = bitmap size * p
for pixel of bitmap:
    distribution[h(pixel), s(pixel), l(pixel)]++
for d of distribution:
    if d < threshold:
        d = 0;
    else
        d = 1
// find all the connected block in the 3-dimensional space of the distribution
for d of distributed:
    if d isn't visited:
        visit d and the connected block starting from d
```

I will try both of two algorithms and find which one is better.
#

## 2. Connected block detection (in progress)
#### find the connected blocks in the bitmap (simple breadth first search)

#

## 3. Smallest element combination (in progress)
#### cluster for the connected blocks (mst algorithm)
