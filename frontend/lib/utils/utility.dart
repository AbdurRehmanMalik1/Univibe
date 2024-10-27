class Utils {
  static String removeExceptionPrefix(String errorMessage) {
    if (errorMessage.startsWith('Exception: ')) {
      return errorMessage.substring('Exception: '.length);
    }
    return errorMessage;
  }

  static String getReadableErrorMessage(String error) {
    error = removeExceptionPrefix(error);
    if (error.contains("XMLHttpRequest error")) {
      return "Could not connect to the server";
    } else if (error.contains("SocketException")) {
      return "Network error: Unable to reach the server";
    } else {
      return error;
    }
  }
}
