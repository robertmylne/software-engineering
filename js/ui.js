$(document).ready(function(){


    /*
        General
    */
    $('#backButton').click(function(){
        $('#V1, #V2, #V3, #V4').hide();
        $('#V1').show();
    });

    //- Back-button for V2
    $('#backButtonV2').click(function(){
        $('#V2').hide();
        $('#V1').show();
    });

    //- Back-button for V3
    $('#backButtonV3').click(function(){
        $('#V3').hide();
        $('#V1').show();
        // $('#costumer-info-none').hide();
        // $('#costumer-info-found').show();
    });

    //- Back-button for V4
    $('#backButtonV4').click(function(){
        $('#V4').hide();
        $('#V3').show();
    });





    //- Buttons
    $('#createOrderButton').click(function(){
        $('#V1').hide();
        $('#V3').show();
    });

    $('#createCostumerButton').click(function(){
        $('#V1').hide();
        $('#V2').show();
    });

    /*
        V2 - Create new costumer
    */





    /*
        V3 - Create order (menu screen)
    */
    var num_items = 5;
    var item_name = "Americano";
    var item_price = 11.90;

    $("img").click(function(){
        $('.order-details').append(`
            <li> # ${num_items} -  ${item_name} $${item_price}
                <ul>
                    <li><i id="plus-btn" class="fa fa-plus-square fa-lg"></i></li>
                    <li><i id="minus-btn" class="fa fa-plus-square fa-lg"></i></li>
                </ul>
            </li>
        `);
    });

    $('#proceedButton').click(function(){
        $('#V3').hide();
        $('#V4').show();
    });

    //- Plus, minus Buttons
    $('#plus-btn').click(function(){
        num_items = num_items - 1;
        console.log(num_items);
    });


    /*
        V4 - Order Confirmation
    */




});
