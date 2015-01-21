

$(document).ready(function () {
    GetCustomersAJAX();
    $("#btnIncluir").click(function () { AddContact(); });
});



function GetCustomersJSON() {

    $("#conteudo").html("");

    $.getJSON("/api/Usuario", function (data) {
        //declare a varialbe which holds html string to be appnended to create a table structure from returned data                
        var strHTML = "";
        strHTML = "<table width='50%' style='border-width:thin;font-family:Verdana;font-size:small;border-collapse:collapse' border='1'>";
        strHTML += "<tr><th>Usuario ID</th><th>Nome</th><th>Sobre Nome</th><th></th><th></tr>";//Email Address</th></tr>";
        //iterate over every object returened using each function                 
        $.each(data, function (key, val) {
            //Form a html row string based on the returned Json object                    
            strHTML += "<tr>";
            strHTML += "<td width='20%' style='border:1 solid gray;'>" + val.Id + "</td>";
            strHTML += "<td width='20%' style='border:1 solid gray;'>" + val.Nome + "</td>";
            strHTML += "<td width='25%' style='border:1 solid gray;'>" + val.SobreNome + "</td>";
            strHTML += "<td width='20%' style='border:1 solid gray;'><a href=\"javascript:;\" onclick=\"GetUsuarioByIdAJAX(" + val.Id + ")\">Editar</a></td>";
            //strHTML += "<td width='20%' style='border:1 solid gray;'>" + val.EmailAddress + "</td>";
            strHTML += "</tr>";
        });
        //append html table to div                
        $('#conteudo').html(strHTML);
    });
}

function GetCustomersAJAX() {

    $("#conteudo").html("");

    $.ajax({
        url: "/api/Usuario/",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            //declare a varialbe which holds html string to be appnended to create a table structure from returned data                
            var strHTML = "<table id=\"tabLista\" width='50%' style='border-width:thin;font-family:Verdana;font-size:small;border-collapse:collapse' border='1'>";
            strHTML += "<tr><th>Usuario ID</th><th>Nome</th><th>Sobre Nome</th><th></th><th></tr>";//Email Address</th></tr>";
            //iterate over every object returened using each function                 
            $.each(data, function (key, val) {
                //Form a html row string based on the returned Json object                    
                strHTML += "<tr>";
                strHTML += "<td width='20%' style='border:1 solid gray;'>" + val.Id + "</td>";
                strHTML += "<td width='20%' style='border:1 solid gray;'>" + val.Nome + "</td>";
                strHTML += "<td width='25%' style='border:1 solid gray;'>" + val.SobreNome + "</td>";
                strHTML += "<td width='20%' style='border:1 solid gray;'><a href=\"javascript:;\" onclick=\"GetUsuarioByIdAJAX(" + val.Id + ")\">Editar</a></td>";
                //strHTML += "<td width='20%' style='border:1 solid gray;'>" + val.EmailAddress + "</td>";
                strHTML += "</tr>";
            });
            $('#conteudo').append(strHTML);
        },
        statusCode: {
            200: function () {
                //alert("All Contact Displayed successfully using AJAX");
            }
        }
    });
};

function AddContact() {

    $("#msg").append();

    //create a Json object based on data entered by user            
    var newUsuario = {
        Nome: $("#txtNome").val(),
        SobreNome: $("#txtSobreNome").val(),
        //MiddleName: $("#ContactMName").val(),
        //LastName: $("#ContactLName").val(),
        //EmailAddress: $("#ContactEmail").val(),
    };
    //call jQuery Ajax method which calls Json.stringify method to convert             
    //the Json object into string and send it with post method            
    $.ajax({
        url: "/api/Usuario",
        data: JSON.stringify(newUsuario),
        type: "POST",
        contentType: "application/json;charset=utf-8",
    }).done(function () {
        $("#msg").html("Usuário incluido com sucesso!");
        $("#conteudo").html("");
        GetCustomersAJAX();
    });
    return false;
}

function GetUsuarioByIdAJAX(UserId) {
    //declare a varialbe which holds html string to be appnended to create a table structure from returned data
    $.ajax({
        url: "/api/Usuario/" + UserId,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != null) {
                $("#txtNome").val(data.Nome);
                $("#txtSobreNome").val(data.SobreNome);
                $("#btnSalvar").click(function () { UpdateContact(data.Id) });
            }
            else {
                alert("Customer does not exists");
                ResetForm();
            }
        },
        statusCode: {
            //Web API Post method returns status code as 201                    
            200: function () {
                $('#errMsg').html('');
                //alert("Contact Displayed successfully using AJAX");
                //GetCustomersById();
            },
            400: function (jqXHR, textStatus, err) {
                $('#errMsg').html('Error: ' + err);
            },
            404: function (jqXHR, textStatus, err) {
                $('#errMsg').html('Error: ' + err);
            }
        }
    });
}

function UpdateContact(UserId) {
    //create a Json object based on data entered by user            
    var updUser = {
        Id: UserId,
        Nome: $("#txtNome").val(),
        SobreNome: $("#txtSobreNome").val(),
        //LastName: $("#ContactLName").val(),
        //EmailAddress: $("#ContactEmail").val(),
    };
    //call jQuery Ajax method which calls Json.stringify method to convert             
    //the Json object into string and send it with post method            
    $.ajax({
        url: "/api/Usuario/" + UserId,
        data: JSON.stringify(updUser),
        type: "PUT",
        contentType: "application/json;charset=utf-8",
        statusCode: {
            //Web API Post method returns status code as 201                    
            200: function () {
                alert("Employee Updated successfully");
                //GetCustomersById();

            }
        }
    }).done(function () {
        GetCustomersAJAX();
    });
    return false;
}

var app = angular.module('app', []);

app.service('MathService', function () {
    this.add = function (a, b) { return a + b };

    this.subtract = function (a, b) { return a - b };

    this.multiply = function (a, b) { return a * b };

    this.divide = function (a, b) { return a / b };
});

app.service('CalculatorService', function (MathService) {

    this.square = function (a) { return MathService.multiply(a, a); };
    this.cube = function (a) { return MathService.multiply(a, MathService.multiply(a, a)); };

});

app.controller('CalculatorController', function ($scope, CalculatorService) {

    $scope.doSquare = function () {
        $scope.answer = CalculatorService.square($scope.number);
    }

    $scope.doCube = function () {
        $scope.answer = CalculatorService.cube($scope.number);
    }
});


var module = angular.module('app2', []);

module.service('ContactService', function () {
    //to create unique contact id
    var uid = 1;

    //contacts array to hold list of all contacts
    var contacts = [{
        id: 0,
        'name': 'Viral',
        'email': 'hello@gmail.com',
        'phone': '123-2343-44'
    }];

    //save method create a new contact if not already exists
    //else update the existing object
    this.save = function (contact) {
        if (contact.id == null) {
            //if this is new contact, add it in contacts array
            contact.id = uid++;
            contacts.push(contact);
        } else {
            //for existing contact, find this contact using id
            //and update it.
            for (i in contacts) {
                if (contacts[i].id == contact.id) {
                    contacts[i] = contact;
                }
            }
        }

    }

    //simply search contacts list for given id
    //and returns the contact object if found
    this.get = function (id) {
        for (i in contacts) {
            if (contacts[i].id == id) {
                return contacts[i];
            }
        }

    }

    //iterate through contacts list and delete 
    //contact if found
    this.delete = function (id) {
        for (i in contacts) {
            if (contacts[i].id == id) {
                contacts.splice(i, 1);
            }
        }
    }

    //simply returns the contacts list
    this.list = function () {
        return contacts;
    }
});

module.controller('ContactController', function ($scope, ContactService) {

    $scope.contacts = ContactService.list();

    $scope.saveContact = function () {
        ContactService.save($scope.newcontact);
        $scope.newcontact = {};
    }

    $scope.delete = function (id) {

        ContactService.delete(id);
        if ($scope.newcontact.id == id) $scope.newcontact = {};
    }

    $scope.edit = function (id) {
        $scope.newcontact = angular.copy(ContactService.get(id));
    }
})
