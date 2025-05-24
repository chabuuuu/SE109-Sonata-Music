/**
 * Utility functions cho xử lý text tiếng Việt
 */

/**
 * Chuyển đổi tiếng Việt có dấu thành không dấu để tìm kiếm
 * @param str Chuỗi tiếng Việt có dấu
 * @returns Chuỗi không dấu
 */
export const removeVietnameseAccents = (str: string): string => {
  if (!str) return '';
  
  // Bảng mapping các ký tự có dấu sang không dấu
  const accentsMap: { [key: string]: string } = {
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    'đ': 'd',
    // Uppercase
    'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A',
    'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
    'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
    'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E',
    'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O',
    'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O',
    'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U',
    'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
    'Đ': 'D'
  };

  return str
    .split('')
    .map(char => accentsMap[char] || char)
    .join('')
    .toLowerCase();
};

/**
 * So sánh 2 chuỗi tiếng Việt không phân biệt dấu
 * @param str1 Chuỗi thứ nhất
 * @param str2 Chuỗi thứ hai
 * @returns true nếu 2 chuỗi giống nhau (không tính dấu)
 */
export const compareVietnameseText = (str1: string, str2: string): boolean => {
  return removeVietnameseAccents(str1) === removeVietnameseAccents(str2);
};

/**
 * Kiểm tra xem chuỗi có chứa từ khóa tìm kiếm không (không phân biệt dấu)
 * @param text Chuỗi cần kiểm tra
 * @param searchTerm Từ khóa tìm kiếm
 * @returns true nếu text chứa searchTerm
 */
export const includesVietnameseText = (text: string, searchTerm: string): boolean => {
  if (!text || !searchTerm) return false;
  const normalizedText = removeVietnameseAccents(text);
  const normalizedSearchTerm = removeVietnameseAccents(searchTerm);
  return normalizedText.includes(normalizedSearchTerm);
};

/**
 * Highlight từ khóa trong text (giữ nguyên dấu gốc)
 * @param text Text gốc
 * @param searchTerm Từ khóa cần highlight
 * @returns Text với từ khóa được wrap trong <mark>
 */
export const highlightVietnameseText = (text: string, searchTerm: string): string => {
  if (!text || !searchTerm) return text;
  
  const normalizedText = removeVietnameseAccents(text);
  const normalizedSearchTerm = removeVietnameseAccents(searchTerm);
  
  const startIndex = normalizedText.indexOf(normalizedSearchTerm);
  if (startIndex === -1) return text;
  
  const endIndex = startIndex + searchTerm.length;
  const before = text.substring(0, startIndex);
  const match = text.substring(startIndex, endIndex);
  const after = text.substring(endIndex);
  
  return `${before}<mark class="bg-yellow-200 px-1 rounded">${match}</mark>${after}`;
}; 