import {v4 as uuidv4} from 'https://jspm.dev/uuid';
import { tweetsData as defaultTweetsData } from './data.js';
let tweetsData = JSON.parse(localStorage.getItem('tweetsData')) || defaultTweetsData;


const allFeed = document.getElementById('feed');
const tweetBtn = document.getElementById('tweet-btn');


tweetBtn.addEventListener('click', function(){
    const tweetInput = document.getElementById('tweet-input');
    if(tweetInput.value){
        const newTweet = {
            handle: `@scrimbabimbim`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        };
        tweetsData.unshift(newTweet);
        saveToLocalStorage();
        tweetInput.value = '';
        renderTweets();
    }
})



document.addEventListener('click', function(e){
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like);
    }
    if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet);
    }
    if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply);
    }
    if (e.target.dataset.replyBtn){
        handleReplyBtnClick(e.target.dataset.replyBtn);
    }
    if (e.target.dataset.deleteTweet) {
    deleteTweet(e.target.dataset.deleteTweet);
}
    if (e.target.dataset.deleteReply) {
    deleteReply(e.target.dataset.deleteReply);
}
});

function saveToLocalStorage() {
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
}

function handleReplyBtnClick(tweetId) {
    const replyInput = document.getElementById(`reply-input-${tweetId}`);
    const replyText = replyInput.value.trim();
    if(replyText){
        const tweetReplyObj = tweetsData.find(function(tweet){
            return tweet.uuid === tweetId;
        })
        const newReply ={
            handle: `@scrimbabimbim`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyText,
        }
        tweetReplyObj.replies.push(newReply);
        saveToLocalStorage();
        replyInput.value = '';
        renderTweets();
        document.getElementById(`replies-${tweetId}`).classList.remove('hidden')
    }
}

function handleLikeClick(tweetId){
    const tweetLikedObj = tweetsData.find(function(tweet){
            return tweet.uuid === tweetId;
        })
        tweetLikedObj.isLiked = !tweetLikedObj.isLiked;
        if (tweetLikedObj.isLiked) {
            tweetLikedObj.likes++;
            saveToLocalStorage();
        }
        else {
            tweetLikedObj.likes--;
            saveToLocalStorage();
        }

        renderTweets()
}

function handleRetweetClick(tweetId){
    const tweetRetweetedObj = tweetsData.find(function(tweet){
            return tweet.uuid === tweetId;
        })
        tweetRetweetedObj.isRetweeted = !tweetRetweetedObj.isRetweeted;
        if (tweetRetweetedObj.isRetweeted) {
            tweetRetweetedObj.retweets++;
            saveToLocalStorage();
        }
        else {
            tweetRetweetedObj.retweets--;
            saveToLocalStorage();
        }

        renderTweets()
}

function handleReplyClick(tweetId){
    document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
}

function renderReplies(replies, tweetId){
    let repliesHtml = '';
    replies.forEach(function(reply, index){
        const isOwnReply = reply.handle === '@scrimbabimbim'; // cek milik sendiri
        repliesHtml += `
        <div class="tweet-reply">
            <div class="tweet-inner">
                <img src="${reply.profilePic}" class="profile-pic">
                <div style="width: 100%">
                    <p class="handle">
                        ${reply.handle}
                        ${isOwnReply ? `<i class="fa-solid fa-xmark delete-reply" data-delete-reply="${tweetId}___${index}" style="float:right;cursor:pointer;"></i>` : ''}
                    </p>
                    <p class="tweet-text">${reply.tweetText}</p>
                </div>
            </div>
        </div>
`})
    repliesHtml += `
        <div class="tweet-reply reply-form">
            <textarea placeholder="Write a reply..." id="reply-input-${tweetId}" class="reply-input"></textarea>
            <button data-reply-btn="${tweetId}" class="reply-btn">Reply</button>
        </div>
    `;
    return repliesHtml;
}

function deleteTweet(tweetId) {
    const tweetIndex = tweetsData.findIndex(function(tweet) {
        return tweet.uuid === tweetId;
    });
    if (tweetIndex !== -1) {
        tweetsData.splice(tweetIndex, 1);
        saveToLocalStorage();
        renderTweets();
    }
}
function deleteReply(combinedId){
    const [tweetId, replyIndex] = combinedId.split('___');
    const tweetObj = tweetsData.find(function(tweet) {
        return tweet.uuid === tweetId;
    });
    if (tweetObj && tweetObj.replies[replyIndex]) {
        tweetObj.replies.splice(replyIndex, 1);
        saveToLocalStorage();
        renderTweets();
        document.getElementById(`replies-${tweetId}`).classList.remove('hidden');
    }
}

function getFeedHtml(){
    let tweethtml ='';
    tweetsData.forEach(function(tweet){
        const isOwnTweet = tweet.handle === '@scrimbabimbim';
        let repliesHtml = '';
        let likedTweet = '';
        let retweetedTweet = '';
        if (tweet.isLiked) {
            likedTweet = 'liked';
        }
        if (tweet.isRetweeted) {
            retweetedTweet = 'retweeted';
        }
        repliesHtml = renderReplies(tweet.replies, tweet.uuid);
        tweethtml += `<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div style="width: 100%">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <p class="handle">${tweet.handle}</p>
                ${isOwnTweet ? `<i class="fa-solid fa-xmark delete-tweet" data-delete-tweet="${tweet.uuid}"></i>` : ''}
            </div>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likedTweet}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetedTweet}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>`;
    allFeed.innerHTML = tweethtml;
}
    )
}

function renderTweets() {
    getFeedHtml();
}  

renderTweets()


/*
streetch goal:
- ability to reply tweet (done)
- ability to delete tweet (done)
- save all in local storage
*/