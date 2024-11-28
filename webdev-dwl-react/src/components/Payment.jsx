function Payment (){

    return(

        // <!-- Payment Slip Section -->
        <div class="payment-slip-section">
            <div class="payment-slip">
                <div class="payment-header">
                    <h3>Payment Slip</h3>
                    <div class="rating">⭐ 4.84</div>
                </div>
                <div class="payment-info">
                    <div class="info-row">
                        <span>From</span>
                        <span>To</span>
                    </div>
                    <div class="info-row">
                        <span>10/01/2022</span>
                        <span>11/01/2022</span>
                    </div>
                    <div class="total">
                        <span>Total (PHP)</span>
                        <span>1,300.00</span>
                    </div>
                </div>
                <button class="pay-button">Pay</button>
                <p class="confirmation-note">Payment confirmation may take up to an hour.</p>
            </div>
        </div>

        
    );
    
    
    }
    
    export default Payment