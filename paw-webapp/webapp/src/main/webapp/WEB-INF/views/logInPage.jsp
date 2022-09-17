<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ page contentType="text/html;charset=UTF-8" %>

<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <%--        Para el Fav icon--%>
        <link rel="icon" type="image/x-icon" href="<c:url value="/resources/img/favicon.ico"/>">
        <%--        <!-- * Link de la libreria de Bootstrap -->--%>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
        <%--       * Referencia a nuestra hoja de estilos propia --%>
        <link href="<c:url value="/resources/css/homeStyles.css"/>" rel="stylesheet" type="text/css"/>
        <link href="<c:url value="/resources/css/navBarStyles.css"/>" rel="stylesheet" type="text/css"/>
        <link href="<c:url value="/resources/css/reviewsStyles.css"/>" rel="stylesheet" type="text/css"/>
        <link href="<c:url value="/resources/css/loginStyles.css"/>" rel="stylesheet" type="text/css"/>
        <link href="<c:url value="/resources/css/reviewRegistrationStyles.css"/>" rel="stylesheet" type="text/css"/>
        <title>Review Registration</title>
    </head>

    <body>
        <div>
            <div>
                <jsp:include page="components/header.jsp">
                    <jsp:param name="type" value="null"/>
                </jsp:include>
            </div>

            <div  class="W-background">
                <c:choose>
        <%--            * Caso en el que ESTA registrado y tiene contrasena--%>
                    <c:when test="${loginStage == 'sign-in'}">
                        <c:url value="/login/sign-in" var="postPath"/>
                        <form action="<c:url value="/login/sign-in"/>" method="post">
                            <div class="W-general-div-login">
                                <div class="W-login-title">
                                    <h4>Login to Watch This</h4>
                                </div>
                                <div class="card W-login-card">
        <%--                    TODO: Ver esto de los errores--%>
        <%--                    <c:if test="${errorMsg!=null && errorMsg != ''}">--%>
        <%--                        <div class="alert alert-danger d-flex align-items-center" role="alert">--%>
        <%--                            <div class="W-register-errorMsg">--%>
        <%--                                <c:out value="${errorMsg}"/>--%>
        <%--                            </div>--%>
        <%--                        </div>--%>
        <%--                    </c:if>--%>
                                    <div class="W-email-verification-message">
                                        <h5>Welcome back!!</h5>
                                    </div>
                                    <div class="mb-3 W-input-label-login-info">
                                      <%--  <form:errors path="email" element="p" cssStyle="color: red"/> --%>
                                        <label class="form-label">Email</label>
                                        <input name="email" type="email" class="form-control"   placeholder="example@email"/>
                                    </div>
                                    <div class="mb-3 W-input-label-login-info">
                                    <%--    <form:errors path="password" element="p" cssStyle="color: red"/>        --%>
                                        <label class="form-label">Password</label>
                                        <input name="password" type="password" class="form-control" placeholder="*****"/>
                                        <a href="<c:url value="//login/forgot-password"/>" class="W-forgot-password">Forgot password?</a>
                                    </div>
                                </div>
                                <div>
                                    <button id="submitButton1" type="submit" class="btn btn-success W-login-button" onclick="this.form.submit(); (this).disabled = true; (this).className += ' spinner-border'; (this).innerText = '|'">Log in</button>
                                </div>
                                <hr class="d-flex W-line-style-login"/>
                                <div class="W-alignment-signup-div">
                                    <h5>Do not have an account?</h5>
                                    <a href="<c:url value="/login/sign-up"/>"><button type="button" class="btn btn-secondary W-sign-up-button-link">Sign up!</button></a>
                                </div>
                            </div>
                        </form>
                    </c:when>
                    <%--            * En el caso de que el NO tenga mail registrado NI ESTE REGISTRADO--%>
                    <c:when test="${loginStage == 'sign-up'}">
                        <c:url value="/login/${loginStage}" var="postPath"/>
                        <form:form modelAttribute="loginForm" action="${postPath}" method="post">
                            <div class="W-general-div-login">
                                <div class="W-login-title">
                                    <h4>Sign up into Watch This</h4>
                                </div>
                                <div class="card W-login-card">
                                        <%--                    TODO: Ver esto de los errores--%>
                                        <%--                    <c:if test="${errorMsg!=null && errorMsg != ''}">--%>
                                        <%--                        <div class="alert alert-danger d-flex align-items-center" role="alert">--%>
                                        <%--                            <div class="W-register-errorMsg">--%>
                                        <%--                                <c:out value="${errorMsg}"/>--%>
                                        <%--                            </div>--%>
                                        <%--                        </div>--%>
                                        <%--                    </c:if>--%>

                                    <div class="mb-3 W-input-label-login-info">
                                        <div class="mb-3 W-input-label-login-info">
                                            <form:errors path="userName" element="p" cssStyle="color: red"/>
                                            <form:label path="userName" class="form-label">Username</form:label>
                                            <form:input type="text" class="form-control" path="userName" placeholder="Example123"/>
                                        </div>
                                    </div>
                                    <div class="mb-3 W-input-label-login-info">
                                        <div class="mb-3 W-input-label-login-info">
                                            <form:errors path="email" element="p" cssStyle="color: red"/>
                                            <form:label path="email" class="form-label">Email</form:label>
                                            <form:input type="email" class="form-control" value="${loginForm.email}" path="email"  placeholder="example@email"/>
                                        </div>
                                    </div>
                                    <div class="mb-3 W-input-label-login-info">
                                        <div class="mb-3 W-input-label-login-info">
                                            <form:errors path="password" element="p" cssStyle="color: red"/>
                                            <form:label path="password" class="form-label">Password</form:label>
                                            <form:input type="password" class="form-control" path="password" placeholder="*****"/>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button id="submitButton2" type="submit" class="btn btn-success W-login-button" onclick="this.form.submit(); (this).disabled = true; (this).className += ' spinner-border'; (this).innerText = '|'">Sign up</button>
                                </div>
                            </div>
                        </form:form>
                    </c:when>

                    <c:when test="${loginStage == 'forgot-password'}">
                        <c:url value="/login/${loginStage}" var="postPath"/>
                        <form:form modelAttribute="loginForm" action="${postPath}" method="post">
                            <div class="W-general-div-login">
                                <div class="W-login-title">
                                    <h4>Forgot your password? That's okey!</h4>
                                </div>
                                <div class="card W-login-card">
                                        <%--                    TODO: Ver esto de los errores--%>
                                        <%--                    <c:if test="${errorMsg!=null && errorMsg != ''}">--%>
                                        <%--                        <div class="alert alert-danger d-flex align-items-center" role="alert">--%>
                                        <%--                            <div class="W-register-errorMsg">--%>
                                        <%--                                <c:out value="${errorMsg}"/>--%>
                                        <%--                            </div>--%>
                                        <%--                        </div>--%>
                                        <%--                    </c:if>--%>

                                    <div class="mb-3 W-input-label-login-info">
                                        <h5 class="W-password-title">Enter your email below to reset your password!</h5>
                                        <div class="mb-3 W-input-label-login-info">
                                            <form:errors path="email" element="p" cssStyle="color: red"/>
                                            <form:label path="email" class="form-label">Email</form:label>
                                            <form:input type="email" class="form-control" value="${loginForm.email}" path="email" placeholder="recoveryemail@email"/>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button id="submitButton3" type="submit" class="btn btn-success W-send-password" onclick="this.form.submit(); (this).disabled = true; (this).className += ' spinner-border'; (this).innerText = '|'">Send</button>
                                </div>
                            </div>
                        </form:form>
                    </c:when>

                    <c:when test="${loginStage == 'set-password'}">
                        <c:url value="/login/${loginStage}" var="postPath"/>
                        <form:form modelAttribute="loginForm" action="${postPath}" method="post">
                            <div class="W-general-div-login">
                                <div class="W-login-title">
                                    <h4>Set your password!</h4>
                                </div>
                                <div class="card W-login-card">
                                        <%--                    TODO: Ver esto de los errores--%>
                                        <%--                    <c:if test="${errorMsg!=null && errorMsg != ''}">--%>
                                        <%--                        <div class="alert alert-danger d-flex align-items-center" role="alert">--%>
                                        <%--                            <div class="W-register-errorMsg">--%>
                                        <%--                                <c:out value="${errorMsg}"/>--%>
                                        <%--                            </div>--%>
                                        <%--                        </div>--%>
                                        <%--                    </c:if>--%>

                                    <div class="mb-3 W-input-label-login-info">
                                        <h5 class="W-password-title">Enter your password below</h5>
                                        <div class="mb-3 W-input-label-login-info">
                                            <form:errors path="password" element="p" cssStyle="color: red"/>
                                            <form:label path="password" class="form-label">Password</form:label>
                                            <form:input type="password" class="form-control" path="password" placeholder="*****"/>
                                        </div>
                                    </div>
                                </div>
                                    <%--                        ver esto cuando setea la password--%>
                                <div>
                                    <button id="submitButton4" type="submit" class="btn btn-success W-send-password" onclick="this.form.submit(); (this).disabled = true; (this).className += ' spinner-border'; (this).innerText = '|'">Set</button>
                                </div>
                            </div
                        </form:form>
                    </c:when>


                    <%--            Para que cargue el verificar mail--%>
                    <c:otherwise>
                        <%--                    TODO: Llamar a la pagina de error?--%>
                    </c:otherwise>

                </c:choose>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossorigin="anonymous"></script>
            </div>
        </div>
    </body>
</html>