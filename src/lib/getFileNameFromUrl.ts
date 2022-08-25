export function getFileNameFromUrl(url: string) {
   var matches = url.match(/\/([^\/?#]+)[^\/]*$/);

   if (matches.length > 1) {
     return matches[1];
   }
	
   return null;
}
