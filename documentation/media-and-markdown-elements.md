# Image syntax in markdown

```markdown

<!-- Image stored in the same directory as the content file -->
<!-- MUST have ./ in the beginning and is relative to the content file -->
![A starry night sky.](./stars.png)

<!-- Image stored in public/images/ -->
<!-- Use the file path relative to public/ -->
![A starry night sky.](/images/stars.png)

<!-- Remote image on another server -->
<!-- Use the full URL of the image -->
![A starry night sky.](https://example.com/images/stars.png)

<!-- Local image stored in src/assets/ -->
<!-- Use a relative file path or import alias -->
![A starry night sky.](../../assets/images/stars.png)
```
