import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FilterService {
  constructor() {}

  globalFilter(columns, data, value) {
    // global filter for lazy loading
    return data.filter(globalFilterData);

    function globalFilterData(data) {
      // callback function
      let matched = false; // flag to check if value exists in the row
      columns.forEach((column) => {
        // Skip if data[column] is undefined or null
        if (data[column] === undefined || data[column] === null) {
          return;
        }
        if (typeof data[column] === "string") {
          // if column datatype is string
          if (data[column].toLowerCase().includes(value.toLowerCase()))
            matched = true; // sets flag to true if value matched
        } else {
          // if column datatype is not string (integers, date etc.)
          if (data[column].toString().includes(value.toString()))
            matched = true; // sets flag to true if value matched
        }
      });
      return matched;
    }
  }

  columnFilter(
    data,
    filterObject //column filter for lazy loading
  ) {
    //debugger;
    if (filterObject.length != 1) {
      return data.filter(filterColumnwiseData);
    } else if (filterObject[0].matchMode == "notEquals") {
      return data.filter(filternotEqualsColumnwiseData);
    } else if (filterObject[0].matchMode == "notContains") {
      return data.filter(filternotContainsColumnwiseData);
    } else if (
      filterObject[0].matchMode == "equals" &&
      filterObject[0].operator == "and"
    ) {
      return data.filter(filterEqualsColumnWiseData);
    } else if (filterObject[0].matchMode == "startsWith") {
      return data.filter(filterStartWithColumnwiseData);
    } else if (filterObject[0].matchMode == "endsWith") {
      return data.filter(filterEndsWithColumnwiseData);
    } else if (
      filterObject[0].matchMode == "lt" ||
      filterObject[0].matchMode == "lte"
    ) {
      return data.filter(filterLessThanColumWiseData);
    } else if (
      filterObject[0].matchMode == "gt" ||
      filterObject[0].matchMode == "gte"
    ) {
      return data.filter(filterGreaterThanColumWiseData);
    } else if (
      filterObject[0].matchMode == "dateIs" ||
      filterObject[0].matchMode == "dateIsNot" ||
      filterObject[0].matchMode == "dateBefore" ||
      filterObject[0].matchMode == "dateAfter"
    ) {
      return data.filter(filterDateisColumWiseData);
    } else {
      return data.filter(filterColumnwiseData);
    }
    function filternotContainsColumnwiseData(data) {
      //callback function
      if (typeof data[filterObject.key] == "string") {
        if (filterObject.length == 1) {
          return !data[filterObject.key]
            .toLowerCase()
            .includes(filterObject[0].value.toLowerCase());
        } else if (filterObject[1].matchMode == "contains") {
          return (
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[1].value.toLowerCase())
          );
        } else if (filterObject[1].matchMode == "startsWith") {
          return (
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            new RegExp("^" + filterObject[1].value.toLowerCase()).test(
              data[filterObject.key].toLowerCase()
            )
          );
        } else if (filterObject[1].matchMode == "endsWith") {
          return (
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            new RegExp(filterObject[1].value.toLowerCase() + "$").test(
              data[filterObject.key].toLowerCase()
            )
          );
        } else if (filterObject[1].matchMode == "equals") {
          return (
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            data[filterObject.key].toLowerCase() ===
              filterObject[1].value.toLowerCase()
          );
        } else if (filterObject[1].matchMode == "notEquals") {
          return (
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase())
          );
        }
      } else if (data[filterObject.key] != null)
        return !data[filterObject.key]
          .toString()
          .includes(filterObject[0].value.toString());
    }
    function filterEqualsColumnWiseData(data) {
      if (typeof filterObject[0].value == "string") {
        if (filterObject.length == 1) {
          return (
            data[filterObject.key].toLowerCase() ===
            filterObject[0].value.toLowerCase()
          );
        } else if (filterObject[1].matchMode == "contains") {
          return (
            data[filterObject.key].toLowerCase() ===
              filterObject[0].value.toLowerCase() &&
            data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[1].value.toLowerCase())
          );
        } else if (filterObject[1].matchMode == "startsWith") {
          return (
            data[filterObject.key].toLowerCase() ===
              filterObject[0].value.toLowerCase() &&
            new RegExp("^" + filterObject[1].value.toLowerCase()).test(
              data[filterObject.key].toLowerCase()
            )
          );
        } else if (filterObject[1].matchMode == "endsWith") {
          return (
            data[filterObject.key].toLowerCase() ===
              filterObject[0].value.toLowerCase() &&
            new RegExp(filterObject[1].value.toLowerCase() + "$").test(
              data[filterObject.key].toLowerCase()
            )
          );
        } else if (
          filterObject[1].matchMode == "notContains" ||
          filterObject[1].matchMode == "notEquals"
        ) {
          return (
            data[filterObject.key].toLowerCase() ===
              filterObject[0].value.toLowerCase() &&
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[1].value.toLowerCase())
          );
        }
      }
      // return filterObject[0].value.toLowerCase().includes(data[filterObject.key].toLowerCase());
      else if (typeof filterObject[0].value == "number") {
        if (filterObject.length == 1) {
          return data[filterObject.key] === filterObject[0].value;
        } else if (filterObject[1].matchMode == "notEquals") {
          return (
            data[filterObject.key] === filterObject[0].value &&
            data[filterObject.key] != filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "lt") {
          return (
            data[filterObject.key] === filterObject[0].value &&
            data[filterObject.key] < filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "gt") {
          return (
            data[filterObject.key] === filterObject[0].value &&
            data[filterObject.key] > filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "lte") {
          return (
            data[filterObject.key] === filterObject[0].value &&
            data[filterObject.key] <= filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "gte") {
          return (
            data[filterObject.key] === filterObject[0].value &&
            data[filterObject.key] >= filterObject[1].value
          );
        }
      } else if (data[filterObject.key] != null)
        return !data[filterObject.key]
          .toString()
          .includes(filterObject[0].value.toString());
    }
    function filternotEqualsColumnwiseData(data) {
      //callback function
      if (typeof data[filterObject.key] == "string") {
        if (filterObject.length == 1) {
          return !data[filterObject.key]
            .toLowerCase()
            .includes(filterObject[0].value.toLowerCase());
        } else if (filterObject[1].matchMode == "startsWith") {
          return (
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            new RegExp("^" + filterObject[1].value.toLowerCase()).test(
              data[filterObject.key].toLowerCase()
            )
          );
        } else if (filterObject[1].matchMode == "endsWith") {
          return (
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            new RegExp(filterObject[1].value.toLowerCase() + "$").test(
              data[filterObject.key].toLowerCase()
            )
          );
        } else if (filterObject[1].matchMode == "contains") {
          return (
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[1].value.toLowerCase())
          );
        } else if (filterObject[1].matchMode == "equals") {
          return (
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            data[filterObject.key].toLowerCase() ===
              filterObject[1].value.toLowerCase()
          );
        } else if (filterObject[1].matchMode == "notContains") {
          return (
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[1].value.toLowerCase())
          );
        }
      } else if (typeof filterObject[0].value == "number") {
        if (filterObject.length == 1) {
          return data[filterObject.key] != filterObject[0].value;
        } else if (filterObject[1].matchMode == "equals") {
          return (
            data[filterObject.key] != filterObject[0].value &&
            data[filterObject.key] === filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "lt") {
          return (
            data[filterObject.key] != filterObject[0].value &&
            data[filterObject.key] < filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "gt") {
          return (
            data[filterObject.key] != filterObject[0].value &&
            data[filterObject.key] > filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "lte") {
          return (
            data[filterObject.key] != filterObject[0].value &&
            data[filterObject.key] <= filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "gte") {
          return (
            data[filterObject.key] != filterObject[0].value &&
            data[filterObject.key] >= filterObject[1].value
          );
        }
      } else if (data[filterObject.key] != null) {
        return !data[filterObject.key]
          .toString()
          .includes(filterObject[0].value.toString());
      }
    }
    function filterStartWithColumnwiseData(data) {
      //callback function
      if (typeof data[filterObject.key] == "string") {
        if (filterObject.length == 1) {
          return new RegExp("^" + filterObject[0].value.toLowerCase()).test(
            data[filterObject.key].toLowerCase()
          );
        } else if (filterObject[1].matchMode == "contains") {
          return (
            new RegExp("^" + filterObject[0].value.toLowerCase()).test(
              data[filterObject.key].toLowerCase()
            ) &&
            data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[1].value.toLowerCase())
          );
        } else if (filterObject[1].matchMode == "endsWith") {
          return (
            new RegExp("^" + filterObject[0].value.toLowerCase()).test(
              data[filterObject.key].toLowerCase()
            ) &&
            new RegExp(filterObject[1].value.toLowerCase() + "$").test(
              data[filterObject.key].toLowerCase()
            )
          );
        } else if (filterObject[1].matchMode == "equals") {
          return (
            new RegExp("^" + filterObject[0].value.toLowerCase()).test(
              data[filterObject.key].toLowerCase()
            ) &&
            data[filterObject.key].toLowerCase() ===
              filterObject[1].value.toLowerCase()
          );
        } else if (
          filterObject[1].matchMode == "notContains" ||
          filterObject[1].matchMode == "notEquals"
        ) {
          return (
            new RegExp("^" + filterObject[0].value.toLowerCase()).test(
              data[filterObject.key].toLowerCase()
            ) &&
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[1].value.toLowerCase())
          );
        }
        //return data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase());
        //  return filterObject[0].value.toLowerCase().includes(data[filterObject.key].toLowerCase())
      } else if (data[filterObject.key] != null)
        // return data[filterObject.key].toString().includes(filterObject[0].value.toString());
        return new RegExp("^" + filterObject[0].value.toLowerCase()).test(
          data[filterObject.key].toLowerCase()
        );
    }
    function filterEndsWithColumnwiseData(data) {
      if (typeof data[filterObject.key] == "string") {
        if (filterObject.length == 1) {
          return new RegExp(filterObject[0].value.toLowerCase() + "$").test(
            data[filterObject.key].toLowerCase()
          );
        } else if (filterObject[1].matchMode == "contains") {
          return (
            new RegExp(filterObject[0].value.toLowerCase() + "$").test(
              data[filterObject.key].toLowerCase()
            ) &&
            data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[1].value.toLowerCase())
          );
        } else if (filterObject[1].matchMode == "startsWith") {
          return (
            new RegExp(filterObject[0].value.toLowerCase() + "$").test(
              data[filterObject.key].toLowerCase()
            ) &&
            new RegExp("^" + filterObject[1].value.toLowerCase()).test(
              data[filterObject.key].toLowerCase()
            )
          );
        } else if (filterObject[1].matchMode == "equals") {
          return (
            new RegExp(filterObject[0].value.toLowerCase() + "$").test(
              data[filterObject.key].toLowerCase()
            ) &&
            data[filterObject.key].toLowerCase() ===
              filterObject[1].value.toLowerCase()
          );
        } else if (
          filterObject[1].matchMode == "notContains" ||
          filterObject[1].matchMode == "notEquals"
        ) {
          return (
            new RegExp(filterObject[0].value.toLowerCase() + "$").test(
              data[filterObject.key].toLowerCase()
            ) &&
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[1].value.toLowerCase())
          );
        }
      } else if (data[filterObject.key] != null) {
        return new RegExp(filterObject[0].value.toLowerCase() + "$").test(
          data[filterObject.key].toLowerCase()
        );
        // return data[filterObject.key].toString().includes(filterObject[0].value.toString());
      }
    }
    function filterLessThanColumWiseData(data) {
      if (
        typeof data[filterObject.key] == "number" &&
        filterObject[0].matchMode == "lt"
      ) {
        if (filterObject.length == 1) {
          return data[filterObject.key] < filterObject[0].value;
        } else if (filterObject[1].matchMode == "equals") {
          return (
            data[filterObject.key] < filterObject[0].value &&
            data[filterObject.key] === filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "notEquals") {
          return (
            data[filterObject.key] < filterObject[0].value &&
            data[filterObject.key] != filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "lte") {
          return (
            data[filterObject.key] < filterObject[0].value &&
            data[filterObject.key] <= filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "gt") {
          return (
            data[filterObject.key] < filterObject[0].value &&
            data[filterObject.key] > filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "gte") {
          return (
            data[filterObject.key] < filterObject[0].value &&
            data[filterObject.key] >= filterObject[1].value
          );
        }
      } else if (
        typeof data[filterObject.key] == "number" &&
        filterObject[0].matchMode == "lte"
      ) {
        if (filterObject.length == 1) {
          return data[filterObject.key] <= filterObject[0].value;
        } else if (filterObject[1].matchMode == "equals") {
          return (
            data[filterObject.key] <= filterObject[0].value &&
            data[filterObject.key] === filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "notEquals") {
          return (
            data[filterObject.key] <= filterObject[0].value &&
            data[filterObject.key] != filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "lt") {
          return (
            data[filterObject.key] <= filterObject[0].value &&
            data[filterObject.key] < filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "gt") {
          return (
            data[filterObject.key] <= filterObject[0].value &&
            data[filterObject.key] > filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "gte") {
          return (
            data[filterObject.key] <= filterObject[0].value &&
            data[filterObject.key] >= filterObject[1].value
          );
        }
        }

        return '';
    }
    function filterGreaterThanColumWiseData(data) {
      if (
        typeof data[filterObject.key] == "number" &&
        filterObject[0].matchMode == "gt"
      ) {
        if (filterObject.length == 1) {
          return data[filterObject.key] > filterObject[0].value;
        } else if (filterObject[1].matchMode == "equals") {
          return (
            data[filterObject.key] > filterObject[0].value &&
            data[filterObject.key] === filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "notEquals") {
          return (
            data[filterObject.key] > filterObject[0].value &&
            data[filterObject.key] != filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "lt") {
          return (
            data[filterObject.key] > filterObject[0].value &&
            data[filterObject.key] < filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "lte") {
          return (
            data[filterObject.key] > filterObject[0].value &&
            data[filterObject.key] <= filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "gte") {
          return (
            data[filterObject.key] > filterObject[0].value &&
            data[filterObject.key] >= filterObject[1].value
          );
        }
      } else if (
        typeof data[filterObject.key] == "number" &&
        filterObject[0].matchMode == "gte"
      ) {
        if (filterObject.length == 1) {
          return data[filterObject.key] >= filterObject[0].value;
        } else if (filterObject[1].matchMode == "equals") {
          return (
            data[filterObject.key] >= filterObject[0].value &&
            data[filterObject.key] === filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "notEquals") {
          return (
            data[filterObject.key] >= filterObject[0].value &&
            data[filterObject.key] != filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "lt") {
          return (
            data[filterObject.key] >= filterObject[0].value &&
            data[filterObject.key] < filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "lte") {
          return (
            data[filterObject.key] >= filterObject[0].value &&
            data[filterObject.key] <= filterObject[1].value
          );
        } else if (filterObject[1].matchMode == "gt") {
          return (
            data[filterObject.key] >= filterObject[0].value &&
            data[filterObject.key] > filterObject[1].value
          );
        }
        }

        return '';
    }
    function filterDateisColumWiseData(data) {
      var filterDate = filterObject[0].value;
      //console.log(filterDate)
      var month = filterDate.getMonth();
      month++;
      if (month < 10) month = "0" + month;
      //console.log(month);
      var dateOfMonth = filterDate.getDate();
      if (dateOfMonth < 10) dateOfMonth = "0" + dateOfMonth;
      var getFullYear = filterDate.getFullYear();
      var format = dateOfMonth + "/" + month + "/" + getFullYear;
      //console.log("filterdate " + format);

      var tableDate = data[filterObject.key];
      //console.log(tableDate);
      var tableMonth = tableDate.getMonth();
      tableMonth++;
      if (tableMonth < 10) tableMonth = "0" + tableMonth;
      var tableMonthDate = tableDate.getDate();
      if (tableMonthDate < 10) tableMonthDate = "0" + tableMonthDate;
      var tableYear = tableDate.getFullYear();
      var dateFormat = tableMonthDate + "/" + tableMonth + "/" + tableYear;
      //console.log("tabledate " + dateFormat);

      if (filterObject.length > 1) {
        var filterDate1 = filterObject[1].value;
        //console.log(filterDate1);
        var month1 = filterDate1.getMonth();
        month1++;
        if (month1 < 10) month1 = "0" + month1;
        //console.log(month1);
        var dateOfMonth1 = filterDate1.getDate();
        if (dateOfMonth1 < 10) dateOfMonth1 = "0" + dateOfMonth1;
        var getFullYear1 = filterDate1.getFullYear();
        var format1 = dateOfMonth1 + "/" + month1 + "/" + getFullYear1;
        //console.log("filterdate1 " + format1)
      }

      if (filterObject[0].matchMode == "dateIs") {
        if (filterObject.length == 1) {
          return dateFormat === format;
        } else if (filterObject[1].matchMode == "dateIsNot") {
          return dateFormat === format && dateFormat != format1;
        } else if (filterObject[1].matchMode == "dateBefore") {
          return (
            dateFormat === format ||
            data[filterObject.key].getTime() < filterObject[0].value.getTime()
          );
        } else if (filterObject[1].matchMode == "dateAfter") {
          return (
            dateFormat === format ||
            data[filterObject.key].getTime() > filterObject[0].value.getTime()
          );
        }
      } else if (filterObject[0].matchMode == "dateIsNot") {
        if (filterObject.length == 1) {
          // return data[filterObject.key].getDate() != filterObject[0].value.getDate();
          return dateFormat != format;
        } else if (filterObject[1].matchMode == "dateIs") {
          return dateFormat != format && dateFormat === format1;
        } else if (filterObject[1].matchMode == "dateBefore") {
          return (
            dateFormat != format &&
            data[filterObject.key].getTime() < filterObject[0].value.getTime()
          );
        } else if (filterObject[1].matchMode == "dateAfter") {
          return (
            dateFormat != format &&
            data[filterObject.key].getTime() > filterObject[0].value.getTime()
          );
        }
      } else if (filterObject[0].matchMode == "dateBefore") {
        if (filterObject.length == 1) {
          return (
            data[filterObject.key].getTime() < filterObject[0].value.getTime()
          );
        } else if (filterObject[1].matchMode == "dateIs") {
          return (
            data[filterObject.key].getTime() <
              filterObject[0].value.getTime() && dateFormat === format1
          );
        } else if (filterObject[1].matchMode == "dateIsNot") {
          return (
            data[filterObject.key].getTime() <
              filterObject[0].value.getTime() && dateFormat != format1
          );
        } else if (filterObject[1].matchMode == "dateAfter") {
          return (
            data[filterObject.key].getTime() <
              filterObject[0].value.getTime() &&
            data[filterObject.key].getTime() > filterObject[1].value.getTime()
          );
        }
      } else if (filterObject[0].matchMode == "dateAfter") {
        if (filterObject.length == 1) {
          return (
            data[filterObject.key].getTime() > filterObject[0].value.getTime()
          );
        } else if (filterObject[1].matchMode == "dateIs") {
          return (
            data[filterObject.key].getTime() >
              filterObject[0].value.getTime() && dateFormat === format1
          );
        } else if (filterObject[1].matchMode == "dateIsNot") {
          return (
            data[filterObject.key].getTime() >
              filterObject[0].value.getTime() && dateFormat != format1
          );
        } else if (filterObject[1].matchMode == "dateBefore") {
          return (
            data[filterObject.key].getTime() >
              filterObject[0].value.getTime() &&
            data[filterObject.key].getTime() < filterObject[1].value.getTime()
          );
        }
        }

        return '';
    }
    function filterColumnwiseData(data) {
      //callback function
      if (typeof data[filterObject.key] == "number") {
        return data[filterObject.key]
          .toString()
          .includes(filterObject.value.toString());
      }
      if (typeof data[filterObject.key] == "string") {
        if (filterObject.length != 1 && filterObject.matchMode == "contains") {
          return data[filterObject.key]
            .toLowerCase()
            .includes(filterObject.value.toLowerCase());
        } else if (
          filterObject.length == 1 &&
          filterObject[0].matchMode == "contains"
        ) {
          return data[filterObject.key]
            .toLowerCase()
            .includes(filterObject[0].value.toLowerCase());
        } else if (filterObject[1].matchMode == "startsWith") {
          return (
            data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            new RegExp("^" + filterObject[1].value.toLowerCase()).test(
              data[filterObject.key].toLowerCase()
            )
          );
        } else if (filterObject[1].matchMode == "endsWith") {
          return (
            data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            new RegExp(filterObject[1].value.toLowerCase() + "$").test(
              data[filterObject.key].toLowerCase()
            )
          );
        } else if (filterObject[1].matchMode == "equals") {
          return (
            data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            data[filterObject.key].toLowerCase() ===
              filterObject[1].value.toLowerCase()
          );
        } else if (
          filterObject[1].matchMode == "notContains" ||
          filterObject[1].matchMode == "notEquals"
        ) {
          return (
            data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[0].value.toLowerCase()) &&
            !data[filterObject.key]
              .toLowerCase()
              .includes(filterObject[1].value.toLowerCase())
          );
        }
        //  return filterObject[0].value.toLowerCase().includes(data[filterObject.key].toLowerCase())
      } else if (data[filterObject.key] != null) {
        let dateformat = new Date(data[filterObject.key]);
        let date = dateformat.getDate();
        return date.toString().includes(filterObject.value.toString());
      }
    }
  }
}
