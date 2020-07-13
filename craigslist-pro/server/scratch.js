var result = $('li.result-row');

result.each((index, element) => {
  const result = $(element);
  //div with class swipe with child index 0 image
  const firstImage = result.find('div.swipe-wrap div[data-index="0"] img').attr('src');
  console.log(firstImage);
});