<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
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
        <title><spring:message code="WatchThisMessage"/></title>
    </head>

    <body>
        <jsp:include page="components/header.jsp">
            <jsp:param name="type" value="${contentType}"/>
            <jsp:param name="genre" value="${genre}"/>
            <jsp:param name="durationFrom" value="${durationFrom}"/>
            <jsp:param name="durationTo" value="${durationTo}"/>
            <jsp:param name="sorting" value="${sorting}"/>
            <jsp:param name="userName" value="${userName}"/>
            <jsp:param name="userId" value="${userId}"/>
            <jsp:param name="admin" value="${admin}"/>
        </jsp:include>

        <div class="W-column-display">
            <jsp:include page="components/filter.jsp">
                <jsp:param name="genre" value="${genre}"/>
                <jsp:param name="durationFrom" value="${durationFrom}"/>
                <jsp:param name="durationTo" value="${durationTo}"/>
                <jsp:param name="type" value="${contentType}"/>
                <jsp:param name="sorting" value="${sorting}"/>
            </jsp:include>

            <div class="W-films-div">
                <div class="row row-cols-1 row-cols-md-2 g-2">
                    <c:forEach var="content" items="${allContent}">
                        <jsp:include page="components/contentCard.jsp">
                            <jsp:param name="contentName" value="${content.name}"/>
                            <jsp:param name="contentReleased" value="${content.released}"/>
                            <jsp:param name="contentCreator" value="${content.creator}"/>
                            <jsp:param name="contentGenre" value="${content.genre}"/>
                            <jsp:param name="contentImage" value="${content.image}"/>
                            <jsp:param name="contentId" value="${content.id}"/>
                            <jsp:param name="contentType" value="${content.type}"/>
                            <jsp:param name="contentRating" value="${content.rating}"/>
                            <jsp:param name="reviewsAmount" value="${content.reviewsAmount}"/>
                            <jsp:param name="userName" value="${userName}"/>
                            <jsp:param name="userWatchListContentId" value="${userWatchListContentId}"/>
                        </jsp:include>
                    </c:forEach>
                </div>
            </div>

            <c:if test="${allContent == null || allContent.size() == 0}">
                <div class="card W-not-found-card">
                    <div class="card-body W-row-display" >
                        <div>
                            <img class="W-not-found" src="<c:url value="/resources/img/noResults.png"/>" alt="Not_Found_Ing"/>
                        </div>
                        <div>
                            <h4 class="W-not-found-message"><spring:message code="Content.NoContent"/></h4>
                        </div>
                    </div>
                </div>
            </c:if>

        </div>
        <div>
            <ul class="pagination justify-content-center W-pagination">
                <c:choose>
                    <c:when test="${query != null}">
                        <c:set var = "baseUrl" scope = "session" value = "/search"/>
                    </c:when>
                    <c:otherwise>
                        <c:set var = "baseUrl" scope = "session" value = "/${contentType}/filters"/>
                    </c:otherwise>
                </c:choose>
                <c:choose>
                    <c:when test="${pageSelected > 1}">
                        <li class="page-item">
                            <a class="page-link" href="<c:url value="${baseUrl}/page/${pageSelected-1}">
                                                                                                 <c:if test="${query != ANY}">
                                                                                                    <c:param name="query" value="${query}"/>
                                                                                                </c:if>
                                                                                                <c:if test="${genre != ANY}">
                                                                                                    <c:param name="genre" value="${genre}"/>
                                                                                                </c:if>
                                                                                                <c:if test="${durationFrom != ANY}">
                                                                                                    <c:param name="durationFrom" value="${durationFrom}"/>
                                                                                                    <c:param name="durationTo" value="${durationTo}"/>
                                                                                                </c:if>
                                                                                                <c:if test="${genre != ANY}">
                                                                                                    <c:param name="sorting" value="${sorting}"/>
                                                                                                </c:if>
                                    </c:url>"><spring:message code="Pagination.Prev"/></a>
                        </li>
                    </c:when>
                    <c:otherwise>
                        <li class="page-item disabled">
                            <a class="page-link" href="#"><spring:message code="Pagination.Prev"/></a>
                        </li>
                    </c:otherwise>
                </c:choose>
                    <%--Si hay menos de 10 paginas, se muestran todas, si hay mas se muestran las 4 antes --%>
                    <%--de la actual, la actual y las 5 proximas, con los bordes ... --%>
                <c:choose>
                    <c:when test="${amountPages > 10 }">
                        <c:forEach var="page" begin="1" end="${amountPages}">
                            <c:choose>
                                <c:when test="${page != pageSelected && ((page > pageSelected - 4 && page<pageSelected) || (page < pageSelected+5 && page > pageSelected))}">
                                    <li class="page-item">
                                        <a class="page-link" href="<c:url value="${baseUrl}/page/${page}">
                                                                        <c:if test="${query != ANY}">
                                                                            <c:param name="query" value="${query}"/>
                                                                        </c:if>
                                                                        <c:if test="${genre != ANY}">
                                                                            <c:param name="genre" value="${genre}"/>
                                                                        </c:if>
                                                                        <c:if test="${durationFrom != ANY}">
                                                                            <c:param name="durationFrom" value="${durationFrom}"/>
                                                                            <c:param name="durationTo" value="${durationTo}"/>
                                                                        </c:if>
                                                                        <c:if test="${genre != ANY}">
                                                                            <c:param name="sorting" value="${sorting}"/>
                                                                        </c:if></c:url> ">
                                            <c:out value="${page}"/>
                                        </a>
                                    </li>
                                </c:when>
                                <c:when test="${page == pageSelected - 4 || page == pageSelected + 5 }">
                                    <li class="page-item">
                                        <a class="page-link" href="<c:url value="${baseUrl}/page/${page}">
                                                                    <c:if test="${query != ANY}">
                                                                        <c:param name="query" value="${query}"/>
                                                                    </c:if>
                                                                    <c:if test="${genre != ANY}">
                                                                        <c:param name="genre" value="${genre}"/>
                                                                    </c:if>
                                                                    <c:if test="${durationFrom != ANY}">
                                                                        <c:param name="durationFrom" value="${durationFrom}"/>
                                                                        <c:param name="durationTo" value="${durationTo}"/>
                                                                    </c:if>
                                                                    <c:if test="${genre != ANY}">
                                                                        <c:param name="sorting" value="${sorting}"/>
                                                                    </c:if>
                                                                </c:url> ">
                                            ...
                                        </a>
                                    </li>
                                </c:when>
                                <c:when test="${page == pageSelected}">
                                    <li class="page-item active">
                                        <a class="page-link" href="<c:url value="${baseUrl}/page/${page}">
                                                                         <c:if test="${query != ANY}">
                                                                            <c:param name="query" value="${query}"/>
                                                                        </c:if>
                                                                        <c:if test="${genre != ANY}">
                                                                            <c:param name="genre" value="${genre}"/>
                                                                        </c:if>
                                                                        <c:if test="${durationFrom != ANY}">
                                                                            <c:param name="durationFrom" value="${durationFrom}"/>
                                                                            <c:param name="durationTo" value="${durationTo}"/>
                                                                        </c:if>
                                                                        <c:if test="${genre != ANY}">
                                                                            <c:param name="sorting" value="${sorting}"/>
                                                                        </c:if></c:url>  ">
                                            <c:out value="${page}"/>
                                        </a>
                                    </li>
                                </c:when>

                                <c:otherwise>

                                </c:otherwise>
                            </c:choose>
                        </c:forEach>
                    </c:when>
                    <c:otherwise>
                        <c:forEach var="page" begin="1" end="${amountPages}">
                            <c:choose>
                                <c:when test="${page == pageSelected}">
                                    <li class="page-item active">
                                        <a class="page-link" href="<c:url value="${baseUrl}/page/${page}">
                                                                         <c:if test="${query != ANY}">
                                                                                <c:param name="query" value="${query}"/>
                                                                            </c:if>
                                                                            <c:if test="${genre != ANY}">
                                                                                <c:param name="genre" value="${genre}"/>
                                                                            </c:if>
                                                                            <c:if test="${durationFrom != ANY}">
                                                                                <c:param name="durationFrom" value="${durationFrom}"/>
                                                                                <c:param name="durationTo" value="${durationTo}"/>
                                                                            </c:if>
                                                                            <c:if test="${genre != ANY}">
                                                                                <c:param name="sorting" value="${sorting}"/>
                                                                            </c:if></c:url>">
                                            <c:out value="${page}"/>
                                        </a>
                                    </li>
                                </c:when>
                                <c:otherwise>
                                    <li class="page-item">
                                        <a class="page-link" href="<c:url value="${baseUrl}/page/${page}">
                                                                         <c:if test="${query != ANY}">
                                                                            <c:param name="query" value="${query}"/>
                                                                        </c:if>
                                                                        <c:if test="${genre != ANY}">
                                                                            <c:param name="genre" value="${genre}"/>
                                                                        </c:if>
                                                                        <c:if test="${durationFrom != ANY}">
                                                                            <c:param name="durationFrom" value="${durationFrom}"/>
                                                                            <c:param name="durationTo" value="${durationTo}"/>
                                                                        </c:if>
                                                                        <c:if test="${genre != ANY}">
                                                                            <c:param name="sorting" value="${sorting}"/>
                                                                        </c:if></c:url>">
                                            <c:out value="${page}"/>
                                        </a>
                                    </li>
                                </c:otherwise>
                            </c:choose>
                        </c:forEach>
                    </c:otherwise>
                </c:choose>


                <c:choose>
                    <c:when test="${pageSelected < amountPages}">
                        <li class="page-item">
                            <a class="page-link" href="<c:url value="${baseUrl}/page/${pageSelected+1}">
                                                                                                 <c:if test="${query != ANY}">
                                                                                                    <c:param name="query" value="${query}"/>
                                                                                                </c:if>
                                                                                                <c:if test="${genre != ANY}">
                                                                                                    <c:param name="genre" value="${genre}"/>
                                                                                                </c:if>
                                                                                                <c:if test="${durationFrom != ANY}">
                                                                                                    <c:param name="durationFrom" value="${durationFrom}"/>
                                                                                                    <c:param name="durationTo" value="${durationTo}"/>
                                                                                                </c:if>
                                                                                                <c:if test="${genre != ANY}">
                                                                                                    <c:param name="sorting" value="${sorting}"/>
                                                                                                </c:if>

                                        </c:url>"><spring:message code="Pagination.Next"/></a>
                        </li>
                    </c:when>
                    <c:otherwise>
                        <li class="page-item disabled">
                            <a class="page-link" href="#"><spring:message code="Pagination.Next"/></a>
                        </li>
                    </c:otherwise>
                </c:choose>

                </li>
            </ul>
        </div>


        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossorigin="anonymous"></script>
    </body>
</html>