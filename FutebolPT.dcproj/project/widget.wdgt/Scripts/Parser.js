/*
 * Copyright (C) 2009, Rui Carlos Gonçalves (rcgoncalves.pt@gmail.com)
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License as published by the Free Software Foundation; either version 2 of the License,
 * or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General
 * Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program; if not,
 * write to the Free Software Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 *
 */

/**
 * Returns the first element from XML formatted string 'str', with tag name 'tag'.
 * It starts searching from 'start'.
 */
function getFirstElementByTagName(str,tag,start)
{
  var strx=str;
  if(start) strx=strx.substr(start);
  strx=removeComments(strx);
  var res="";
  var open=new RegExp("<"+tag+"[^>]*>","i");
  var close=new RegExp("</"+tag+" *>","i");
  var pos1=strx.search(open);
  var pos2;
  var pos=pos1;
  var count;
  
  if(pos<0) return "";
  else
  {
    strx=strx.substr(pos);
    res=strx.substr(0,1);
    strx=strx.substr(1);
    count=1;
    var error=false;
    
    while(count>0 && !error)
    {
      pos1=strx.search(open);
      pos2=strx.search(close);
      if(pos2<0) error=true;
      
      if(pos1<pos2 && pos1>=0) //open tag
      {
        count++;
        pos=pos1;
      }
      else if(pos2>=0) //close tag
      {
        count--;
        pos=pos2;
      }
      
      res+=strx.substr(0,pos+1);
      strx=strx.substr(pos+1);
    }
    
    if(error) return "";
    else return res+"/"+tag+">";
  }
}

/**
 * Remove XML comments from the string 'str'.
 */
function removeComments(str)
{
  var start=str.indexOf("<!--");
  var end;
  while(start>=0)
  {
    end=str.indexOf("-->");
    if(end<=start) start=-1;
    else
    {
      str=str.substr(0,start)+str.substr(end+3);
      start=str.indexOf("<!--");
    }
  }
  
  return str;
}

function removeSpaces(str)
{
  var res=str.replace(/\s+/g,"");
  return res;
}

function removeTags(str)
{
  var res=str.replace(/<[^>]*>/g,"");
  return res;
}