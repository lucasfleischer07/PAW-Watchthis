import CarrouselContent from "./components/CarrouselContent";
import {useTranslation} from "react-i18next";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {contentService} from "../services";
import Header from "./components/Header";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const {t} = useTranslation()
    let navigate = useNavigate()
    let {isLogged, signOut, listApi} = useContext(AuthContext)

    const [user, setUser] = useState(localStorage.hasOwnProperty("user")? JSON.parse(localStorage.getItem("user")) : null)
    const [bestRatedList, setBestRatedList] = useState([])
    const [lastAddedList, setLastAddedList] = useState([])
    const [mostSavedContentByUsersList, setMostSavedContentByUsersList] = useState([])
    const [recommendedUserList, setRecommendedUserList] = useState(new Array(0))

    const [userWatchListIds, setUserWatchListIds] = useState(new Array(0))

    const [logOut, setLogOut] = useState(false)


    useEffect(() => {
        contentService.getLandingPage()
            .then(list => {
                if(!list.error) {
                    setBestRatedList(list.data.bestRatedList)
                    setLastAddedList(list.data.lastAddedList)
                    if(list.data.hasOwnProperty("recommendedUserList") && (list.data.recommendedUserList.length > 0)) {
                        setRecommendedUserList(list.data.recommendedUserList)
                    } else {
                        setMostSavedContentByUsersList(list.data.mostSavedContentByUsersList)
                    }
                }
            })
            .catch(() => {
                navigate("/error", { replace: true, state: {errorCode: 404} })
            })

        if(isLogged()) {
            listApi.getUserWatchListContentIds(user?.id)
                .then(watchList => {
                    if(!watchList.error) {
                        setUserWatchListIds(watchList.data)
                    } else {
                        if(watchList.errorCode === 404) {
                            signOut()
                            navigate("/", { replace: true })
                        } else {
                            navigate("/error", { replace: true, state: {errorCode: watchList.errorCode} })
                        }
                    }
                })
                .catch(() => {
                    navigate("/error", { replace: true, state: {errorCode: 404} })
                })
        } else {
            setUser(null)
        }
    }, [logOut])




    useEffect(() => {
        document.title = t('WatchThisMessage')
    })

    return(
        <div>
            <Header
                type="all"
                admin={user?.role === 'admin'}
                userName={user?.username}
                setUser={setUser}
                userId={user?.id}
                setLogOut={setLogOut}
            />

            <div className="W-carousels-div">
                {isLogged() && userWatchListIds.length !== 0 && recommendedUserList.length !== 0 ? (
                    <>
                        <h3 className="W-carousel-title">{t('Content.Carousel.RecommendedForYou')}</h3>
                        <div id="carouselRecommended" className="carousel slide" data-ride="carousel">
                            <div className="carousel-inner">
                                {[...Array(Math.ceil(recommendedUserList.length / 5)).keys()]
                                    .map((externalIndex) => (
                                            <div className={`carousel-item ${externalIndex === 0 ? "active" : ""}`} key={externalIndex}>
                                                <div className="cards-wrapper">
                                                    {[...Array(Math.min(5, recommendedUserList.length - externalIndex * 5)).keys()]
                                                        .map((internalIndex) => (
                                                                <CarrouselContent
                                                                    name={recommendedUserList[internalIndex + externalIndex * 5].name}
                                                                    releaseDate={recommendedUserList[internalIndex + externalIndex * 5].releaseDate}
                                                                    creator={recommendedUserList[internalIndex + externalIndex * 5].creator}
                                                                    genre={recommendedUserList[internalIndex + externalIndex * 5].genre}
                                                                    contentPictureUrl={recommendedUserList[internalIndex + externalIndex * 5].contentPictureUrl}
                                                                    id={recommendedUserList[internalIndex + externalIndex * 5].id}
                                                                    type={recommendedUserList[internalIndex + externalIndex * 5].type}
                                                                    rating={recommendedUserList[internalIndex + externalIndex * 5].rating}
                                                                    reviewsAmount={recommendedUserList[internalIndex + externalIndex * 5].reviewsAmount}
                                                                    image={recommendedUserList[internalIndex + externalIndex * 5].contentPictureUrl}
                                                                    user={user}
                                                                    isInWatchList={userWatchListIds.length > 0 ? userWatchListIds.some(item => item.id === recommendedUserList[internalIndex + externalIndex * 5].id) : false}
                                                                    key={internalIndex}
                                                                    loggedUserId={user?.id}
                                                                />
                                                            )
                                                        )}
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselRecommended" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">{t('Content.Carousel.PreviousButton')}</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselRecommended" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">{t('Content.Carousel.NextButton')}</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div>
                        <h3 className="W-carousel-title">{t('Content.Carousel.MostSaved')}</h3>
                        <div id="mostSavedContentByUsersList" className="carousel slide" data-ride="carousel">
                            <div className="carousel-inner">
                                {[...Array(Math.ceil(mostSavedContentByUsersList.length / 5)).keys()].map((index) => (
                                    <div key={index} className={`carousel-item${index === 0 ? " active" : ""}`}>
                                        <div className="cards-wrapper">
                                            {mostSavedContentByUsersList.slice(index * 5, index * 5 + 5)
                                                .map((content) => (
                                                    <CarrouselContent
                                                        name={content.name}
                                                        releaseDate={content.releaseDate}
                                                        creator={content.creator}
                                                        genre={content.genre}
                                                        contentPictureUrl={content.contentPictureUrl}
                                                        id={content.id}
                                                        type={content.type}
                                                        rating={content.rating}
                                                        reviewsAmount={content.reviewsAmount}
                                                        image={content.contentPictureUrl}
                                                        user={user}
                                                        isInWatchList={userWatchListIds.length > 0 ? userWatchListIds.some(item => item.id === content.id) : false}
                                                        key={index}
                                                        loggedUserId={user?.id}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#mostSavedContentByUsersList" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">{t('Content.Carousel.PreviousButton')}</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#mostSavedContentByUsersList" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">{t('Content.Carousel.NextButton')}</span>
                            </button>
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="W-carousel-title">{t('Content.Carousel.BestRatedContent')}</h3>
                    <div id="carouselMostReviewed" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {[...Array(Math.ceil(bestRatedList.length / 5)).keys()].map((index) => (
                                <div key={index} className={`carousel-item${index === 0 ? " active" : ""}`}>
                                    <div className="cards-wrapper">
                                        {bestRatedList.slice(index * 5, index * 5 + 5)
                                            .map((content, j) => (
                                                <CarrouselContent
                                                    key={index * 5 + j}
                                                    name={content.name}
                                                    releaseDate={content.releaseDate}
                                                    creator={content.creator}
                                                    genre={content.genre}
                                                    id={content.id}
                                                    type={content.type}
                                                    rating={content.rating}
                                                    reviewsAmount={content.reviewsAmount}
                                                    image={content.contentPictureUrl}
                                                    isInWatchList={userWatchListIds.length > 0 ? userWatchListIds.some(item => item.id === content.id) : false}
                                                    user={user}
                                                    loggedUserId={user?.id}
                                                />
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselMostReviewed" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">{t('Content.Carousel.PreviousButton')}</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselMostReviewed" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">{t('Content.Carousel.NextButton')}</span>
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="W-carousel-title">{t('Content.Carousel.LastAdded')}</h3>
                    <div id="carouselLastAdded" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {[...Array(Math.ceil(lastAddedList.length / 5)).keys()].map((index) => (
                                <div key={index} className={`carousel-item${index === 0 ? " active" : ""}`}>
                                    <div className="cards-wrapper">
                                        {lastAddedList.slice(index * 5, index * 5 + 5).map((content, j) => (
                                            <CarrouselContent
                                                key={index * 5 + j}
                                                name={content.name}
                                                releaseDate={content.releaseDate}
                                                creator={content.creator}
                                                genre={content.genre}
                                                id={content.id}
                                                type={content.type}
                                                rating={content.rating}
                                                reviewsAmount={content.reviewsAmount}
                                                image={content.contentPictureUrl}
                                                isInWatchList={userWatchListIds.length > 0 ? userWatchListIds.some(item => item.id === content.id) : false}
                                                user={user}
                                                loggedUserId={user?.id}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselLastAdded" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">{t('Content.Carousel.PreviousButton')}</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselLastAdded" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">{t('Content.Carousel.NextButton')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}