fn main(cc_number: u64, exp_date: u32,current_date: pub u32) {
    // Hardcoded mock values for testing
    let compcc: u64 = 6268857032070713;
    let compexp: u32 = 3212; // Expected expiration date (MMYY format)

    // Assertions to verify the inputs match the expected values
    assert(compcc == cc_number);
    assert(compexp == exp_date);

    // Step 1: Verify card number using Luhn Algorithm
    let valid_card = is_valid_card(cc_number);
    assert(valid_card, "Card number is invalid.");

    // Step 2: Expiration check
    let expiration_check: bool = exp_date >= current_date;

    // Step 3: Ensure the card is not expired
    assert(expiration_check, "Card is expired.");
}

// Assuming Field is defined and has the necessary methods
fn is_valid_card(cc_number: u64) -> bool {
    let mut digits: [u32; 16] = [0; 16];
    let mut num = cc_number;

    // Populate the digits array by extracting digits from the credit card number
    for i in 0..digits.len() {
        digits[i] = (num as u32 % 10);  // Store the last digit
        num /= 10;  // Remove the last digit
    }
    // Reverse the array to align correctly for the Luhn algorithm
    let len = digits.len();
    for i in 0..len / 2 {
        let temp = digits[i];
        digits[i] = digits[len - 1 - i];
        digits[len - 1 - i] = temp;
    }
    let mut sum = 0;
    for i in 0..len {
        let mut n = digits[i];  // No need for conversion, as digits are already u32

        // Double every second digit from the right (Luhn algorithm)
        if i as u32 % 2 == 1 { // Check if the position from the right is odd
            n *= 2;  // Double the value
            if n > 9 {  // If the result is greater than 9, subtract 9
                n -= 9;
            }
        }

        sum += n;  // Add to the sum
        
    }

    sum % 10 == 0 // Return true if the sum modulo 10 is zero

}

#[test]
fn test_main() {
    // Mock inputs for a valid card
    let cc_number_valid: u64 = 6268857032070713;  // A valid card number
    let exp_date_valid: u32 = 3212; // MMYY format (e.g., December 2024)
    let current_date: u32 = 2410; // Current date in MMYY format (e.g., November 2024)

    // Test with a valid card (not expired)
    main(cc_number_valid, exp_date_valid, current_date);
}

