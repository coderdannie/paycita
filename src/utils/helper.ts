export const formatDate = (
  date: Date | string | number | null | undefined,
  fallback: string = ""
): string => {
  if (!date) return fallback;

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return fallback;

  // Format date in local timezone
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const year = dateObj.getFullYear();

  return `${day} ${month} ${year}`;
};

export const updateDateTime = (timeZone: string = "UTC") => {
  const now = new Date();
  // Use the provided timeZone to ensure consistent formatting
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  };

  const formattedDateTime = now
    .toLocaleString("en-US", options)
    .replace(/,([^,]*)$/, " -$1")
    .replace(" AM", "am")
    .replace(" PM", "pm");
  return formattedDateTime;
};

export const formatTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC",
  };

  const date = new Date(dateString);
  return date.toLocaleString("en-US", options);
};

export const parseDateString = (dateString: string): Date => {
  if (!dateString) return new Date();

  // Create date object and set time to start of day in local timezone
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const formatTimeString = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export const formatLongCurrency = (
  val: number,
  symbol?: string | undefined,
  maximumFractionDigits?: number
) => {
  const formattedValue = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: maximumFractionDigits ? maximumFractionDigits : 0,
    currencyDisplay: "code",
  })
    .format(Number(val?.toString().replace(/,/g, ""))) // Convert to number
    .replace("USD", symbol ? symbol : "")
    .trim();

  return formattedValue;
};

export const formatTimeAgo = (date: string | Date): string => {
  const now = new Date().getTime();
  const time = new Date(date).getTime();
  const diff = now - time;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds}s ago`;
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

export const numberToWords = (num: number): string => {
  if (num === 0) return "zero";

  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  const thousands = ["", "thousand", "million", "billion", "trillion"]; // Add more if needed

  // Helper function to convert a number less than 1000
  const convertLessThanOneThousand = (n: number): string => {
    let result = "";
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " hundred";
      n %= 100;
      if (n > 0) result += " and "; // Add space if there are tens/ones
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) result += "-"; // Add hyphen for numbers like twenty-one
    }
    if (n >= 10) {
      // Handle teens separately if result is empty or ends with space
      if (result && !result.endsWith(" ")) result += " ";
      result += teens[n - 10];
      n = 0; // Handled teens, reset n
    }
    if (n > 0) {
      // Handle ones
      if (result && !result.endsWith(" ") && !result.endsWith("-"))
        result += " ";
      result += ones[n];
    }
    return result.trim();
  };

  if (num < 0) return "minus " + numberToWords(Math.abs(num));

  // Handle potential decimal part (optional, basic implementation)
  const numStr = num.toString();
  const [integerPartStr, decimalPartStr] = numStr.split(".");
  let integerPart = parseInt(integerPartStr, 10);

  let words = "";
  let i = 0;

  if (integerPart === 0 && !decimalPartStr) return "zero"; // Handle case where only integer part is 0

  if (integerPart === 0 && decimalPartStr) {
    // Handle 0.xx cases
    words = "zero";
  } else {
    while (integerPart > 0) {
      if (integerPart % 1000 !== 0) {
        words =
          convertLessThanOneThousand(integerPart % 1000) +
          (thousands[i] ? " " + thousands[i] : "") +
          (words ? " " + words : "");
      }
      integerPart = Math.floor(integerPart / 1000);
      i++;
    }
  }

  // Add decimal part if exists (e.g., " naira and fifty kobo") - Customize as needed
  if (decimalPartStr) {
    const decimalNum = parseInt(
      decimalPartStr.padEnd(2, "0").substring(0, 2),
      10
    ); // Assuming 2 decimal places for currency
    if (decimalNum > 0) {
      // You might want currency-specific logic here, e.g., "Naira" and "Kobo"
      words += (words ? " and " : "") + numberToWords(decimalNum) + " kobo"; // Example for Kobo
    }
  }

  // Basic capitalization and cleanup
  words = words.trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

export const imageToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    // Input validation
    if (!url) {
      return reject(new Error("Image URL is required."));
    }

    fetch(url) // Attempt to fetch the image
      .then((response) => {
        if (!response.ok) {
          // Handle HTTP errors (e.g., 404 Not Found, 403 Forbidden)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob(); // Get the image data as a Blob
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Resolve with the Base64 Data URL string
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          // Handle FileReader errors
          reject(new Error("Failed to read image blob: " + error));
        };
        reader.readAsDataURL(blob); // Read the Blob as Data URL
      })
      .catch((error) => {
        // Handle fetch errors (network issues, CORS blockage)
        console.error("Failed to fetch or process image:", error);
        reject(
          new Error(
            "Failed to fetch image. Check URL and CORS policy. " + error
          )
        );
      });
  });
};

export const formatLabel = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const downloadTemplate = (
  templatePath: string,
  downloadName?: string,
  showToast: boolean = false
) => {
  try {
    // Create a link element and trigger download
    const link = document.createElement("a");
    link.href = templatePath;
    link.download = downloadName || templatePath.split("/").pop() || "template";

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showToast && typeof window !== "undefined") {
      // Only show toast if we're in the browser and showToast is true
      console.log("Template downloaded successfully");
    }

    return { success: true, message: "Template downloaded successfully" };
  } catch (error) {
    console.error("Error downloading template:", error);

    if (showToast && typeof window !== "undefined") {
      console.error("Failed to download template");
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Download failed",
    };
  }
};
export const downloadPayrollTemplate = () => {
  return downloadTemplate(
    "/docs/Payroll Test Template.xlsx",
    "Payroll_Template.xlsx",
    true
  );
};
