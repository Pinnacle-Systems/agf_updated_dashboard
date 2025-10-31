import moment from "moment";
import secureLocalStorage from "react-secure-storage";


export const currentDate = (date) => (moment(date).format('DD/MM/YYYY '))
// import { IMAGE_UPLOAD_URL } from "../Constants";


// export function getImageUrlPath(fileName) {
//   return `${IMAGE_UPLOAD_URL}${fileName}`
// }
export function findFromListFromMatchField(valueField, value, list, property) {
  if (!list) return ""
  let data = list.find(i => i?.[valueField] == value)
  if (!data) return ""
  return data[property]
}


export function findFromListFromSizeList(valueField, value, list, property) {
  if (!list) return ""
  let data = list.find(i => i?.[valueField] == value)
  if (!data) return ""
  return data[property]?.length
}


export function generateSessionId(length = 8) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function findDateInRange(fromDate, toDate, checkDate) {
  if ((fromDate <= checkDate) && (checkDate <= toDate)) {
    return true
  }
  return false;
}

export function latestExpireDateWithinNDays(latesExpireDate = secureLocalStorage.getItem(sessionStorage.getItem("sessionId") + "latestActivePlanExpireDate"), n = 20) {
  if (differenceInTimeToInDays(differenceInTime(new Date(latesExpireDate), new Date())) <= n) {
    return true;
  }
  return false;
}

export function differenceInTime(dateOne, dateTwo) {
  return dateOne.getTime() - dateTwo.getTime();
}

export function differenceInTimeToInDays(differenceInTime) {
  return differenceInTime / (1000 * 3600 * 24);
}


export const getDateArray = function (start, end) {
  let arr = [];
  let dt = new Date(start);
  end = new Date(end);
  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}

// React paginate, page index starts with 0 ,
//  actual page number starts with 1 so, input to 
// react-paginate and valueFrom react-paginate converted

export function pageNumberToReactPaginateIndex(pageNumber) {
  return pageNumber - 1;
}

export function reactPaginateIndexToPageNumber(pageIndex) {
  return pageIndex + 1;
}

export function viewBase64String(base64String) {
  return "data:image/png;base64, " + base64String
}

export function hasPermission(permission) {
  if (Boolean(secureLocalStorage.getItem(sessionStorage.getItem("sessionId") + "superAdmin"))) {
    return true;
  }
  return JSON.parse(secureLocalStorage.getItem(sessionStorage.getItem("sessionId") + "userRole")).role.RoleOnPage.find(item => item.pageId === parseInt(secureLocalStorage.getItem(sessionStorage.getItem("sessionId") + "currentPage")))[permission]
}

export function getYearShortCode(fromDate, toDate) {
  return `${new Date(fromDate).getFullYear().toString().slice(2)}-${new Date(toDate).getFullYear().toString().slice(2)}`
}

export const handleKeyDown = (event, callback) => {
  let charCode = String.fromCharCode(event.which).toLowerCase();
  if ((event.ctrlKey || event.metaKey) && charCode === 's') {
    event.preventDefault();
    callback();
  }
}

export function calculateAge(dob) {
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

export function isSameDay(d1, d2) {
  return moment.utc(d1).format("YYYY-MM-DD") === moment.utc(d2).format("YYYY-MM-DD")
}

// Convert number to words

const arr = x => Array.from(x);
const num = x => Number(x) || 0;
const isEmpty = xs => xs.length === 0;
const take = n => xs => xs.slice(0, n);
const drop = n => xs => xs.slice(n);
const reverse = xs => xs.slice(0).reverse();
const comp = f => g => x => f(g(x));
const not = x => !x;
const chunk = n => xs =>
  isEmpty(xs) ? [] : [take(n)(xs), ...chunk(n)(drop(n)(xs))];

// numToWords :: (Number a, String a) => a -> String
export const numToWords = n => {

  let a = [
    '', 'one', 'two', 'three', 'four',
    'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
    'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
  ];

  let b = [
    '', '', 'twenty', 'thirty', 'forty',
    'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
  ];

  let g = [
    '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion',
    'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion'
  ];

  // this part is really nasty still
  // it might edit this again later to show how Monoids could fix this up
  let makeGroup = ([ones, tens, huns]) => {
    return [
      num(huns) === 0 ? '' : a[huns] + ' hundred ',
      num(ones) === 0 ? b[tens] : b[tens] && b[tens] + '-' || '',
      a[tens + ones] || a[ones]
    ].join('');
  };

  let thousand = (group, i) => group === '' ? group : `${group} ${g[i]}`;

  if (typeof n === 'number')
    return numToWords(String(n));
  else if (n === '0')
    return 'zero';
  else
    return comp(chunk(3))(reverse)(arr(n))
      .map(makeGroup)
      .map(thousand)
      .filter(comp(not)(isEmpty))
      .reverse()
      .join(' ');
};


export function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}

export const getDateFromDateTime = (dateTime) => moment.utc(dateTime).format("YYYY-MM-DD")
export const getDateFromDateTimeToDisplay = (dateTime) => moment.utc(dateTime).format("DD-MM-YYYY")


export function findFromList(id, list, property) {
  if (!list) return ""
  let data = list?.find(i => parseInt(i.id) === parseInt(id))
  if (!data) return ""
  return data[property]
}
export function findFromListReturnsItem(id, list) {
  if (!list) return ""
  let data = list.find(i => parseInt(i.id) === parseInt(id))
  if (!data) return ""
  return data
}

export function isBetweenRange(startValue, endValue, value) {
  console.log(startValue, endValue, value,"startValue, endValue, value")
  return (parseFloat(startValue) <= parseFloat(value)) && (parseFloat(value) <= parseFloat(endValue))
}

export function substract(num1, num2) {
  let n1 = parseFloat(num1) * 1000;
  let n2 = parseFloat(num2) * 1000;
  let result = (n1 - n2) / 1000
  return result;
}

export function getAllowableReturnQty(inwardedQty, returnedQty, stockQty) {
  console.log(inwardedQty,"inwardedQty",returnedQty,"returnedQty",stockQty,"stockQty")
  let balanceReturnQty = parseFloat(inwardedQty) + parseFloat(returnedQty);
  console.log(balanceReturnQty < stockQty,"balanceReturnQty",balanceReturnQty , "stockQty",stockQty)
  return (balanceReturnQty < parseFloat(stockQty)) ? balanceReturnQty : parseFloat(stockQty)
}

export function priceWithTax(price, tax) {
  if (!price) return 0
  if (!tax) return parseFloat(price)
  let taxAmount = (parseFloat(price) / 100) * parseFloat(tax)
  return parseFloat(price) + taxAmount
}


export function getItemFullNameFromShortCode(shortCode) {
  let fullForm = "";
  switch (shortCode) {
    case "GY":
      fullForm = "GreyYarn"
      break;
    case "GF":
      fullForm = "GreyFabric"
      break;
    case "DY":
      fullForm = "DyedYarn"
      break;
    case "DF":
      fullForm = "DyedFabric"
      break;
    default:
      break;
  }
  return fullForm
}

export function filterGodown(store, itemShortCode) {
  if (itemShortCode.includes("Y")) {
    return store.isYarn
  } else if (itemShortCode.includes("F")) {
    return store.isFabric
  }
}

export const params = {
  companyId: secureLocalStorage.getItem(
    sessionStorage.getItem("sessionId") + "userCompanyId"
  ),
  branchId: secureLocalStorage.getItem(
    sessionStorage.getItem("sessionId") + "currentBranchId"
  ),
  userId: secureLocalStorage.getItem(
    sessionStorage.getItem("sessionId") + "userId"
  ),
  finYearId: secureLocalStorage.getItem(sessionStorage.getItem("sessionId") + 'currentFinYear')
};

export const getCommonParams = () => ({
  companyId: secureLocalStorage.getItem(
    sessionStorage.getItem("sessionId") + "userCompanyId"
  ),
  branchId: secureLocalStorage.getItem(
    sessionStorage.getItem("sessionId") + "currentBranchId"
  ),
  userId: secureLocalStorage.getItem(
    sessionStorage.getItem("sessionId") + "userId"
  ),
  finYearId: secureLocalStorage.getItem(sessionStorage.getItem("sessionId") + 'currentFinYear')
})

export function convertSpaceToUnderScore(str) {

  return str.toLowerCase().trim().split(' ').join('_');
}

export function isGridDatasValid(datas, isRequiredAllData, mandatoryFields = []) {

  if (isRequiredAllData) {
    let gridDatasValid = datas.every(obj =>
      Object.values(obj).every(value => value !== "" && value !== null && value !== 0))
    return gridDatasValid
  }
  else {
    let gridDatasValid = datas.every(obj =>
      mandatoryFields.every(field => (obj[field]) && (obj[field] !== "") && (obj[field] !== null) && (parseFloat(obj[field]) !== 0)
      ))
    return gridDatasValid;
  }
}

export const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export function sumArray(arr, property) {
  return arr?.reduce((total, current) => parseFloat(total) + parseFloat(current[property]), 0)
}

export function getBalanceBillQty(inwardQty, returnQty, alreadyBilledQty) {
  return substract(substract(inwardQty, returnQty), alreadyBilledQty).toFixed(3)
}

export function printDiv(divName) {
  var printContents = document.getElementById(divName).innerHTML;
  var originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
}

export function getDiscountAmount(discountType, discountValue, grossAmount) {
  return discountType ? ((discountType === 'Flat') ? discountValue : grossAmount / 100 * parseFloat(discountValue)) : 0
}

export function getPriceColumnFromPriceRange(priceRange) {
  const i = {
    ECONOMY: 'lowPrice',
    STANDARD: 'mediumPrice',
    PREMIER: 'highPrice',
  }
  return i[priceRange]
}


export function renameFile(originalFile) {
  const file = new File([originalFile], Date.now() + originalFile.name, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
  return file;
}


export async function classListData(data){
  let classData = data;
  const order = { "PLAYSCHOOL": 0, "PRE-KG": 1, "LKG": 2, "UKG": 3 };

  classData.sort((a, b) => {
      const extractParts = (className) => {
          let match = className.match(/^([A-Za-z]+)-?(\d*)([A-Za-z]*)$/);
          if (!match) return [Infinity, "", ""]; 
  
          let [_, prefix, num, suffix] = match;
          num = num ? parseInt(num, 10) : (order[prefix] !== undefined ? order[prefix] : Infinity);
          
          return [order[prefix] !== undefined ? order[prefix] : num, num, suffix];
      };
  
      let [orderA, numA, suffixA] = extractParts(a.name);
      let [orderB, numB, suffixB] = extractParts(b.name);
  
      if (orderA !== orderB) return orderA - orderB;
      if (numA !== numB) return numA - numB;
      return suffixA.localeCompare(suffixB);
    });
}


export function autoFocusSelect(el, refObj, condition = true) {
  if (el && condition) {
    el.focus();

    const ev = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "ArrowDown",
      code: "ArrowDown",
    });
    el.dispatchEvent(ev);
  }

  if (refObj && typeof refObj === "object") {
    if (el) {
      refObj.current = el;
    }
  }
}

