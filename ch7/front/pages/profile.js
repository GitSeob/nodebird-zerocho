import React, { useEffect, useCallback, useState } from 'react';
import { List, Button, Card, Icon } from 'antd'
import NicknameEditForm from '../components/NicknameEditForm'
import { useDispatch, useSelector } from 'react-redux'
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, UNFOLLOW_USER_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard'

const Profile = () => {
    const dispatch = useDispatch()
    const { me, followingList, followerList, hasMoreFollower, hasMoreFollowing } = useSelector(state=>state.user)
    const { mainPosts } = useSelector(state=>state.post)
    

    const onUnfollow = useCallback(userId => () => {
        dispatch({
            type: UNFOLLOW_USER_REQUEST,
            data: userId
        })
    }, [])

    const onRemoveFollwer = useCallback(userId => () => {
        dispatch({
            type: REMOVE_FOLLOWER_REQUEST,
            data: userId,
        })
    }, [])

    const loadMoreFollowings = useCallback(()=>{
        dispatch({
            type: LOAD_FOLLOWINGS_REQUEST,
            offset: followingList.length,
        })
    }, [])

    const loadMoreFollowers = useCallback(()=>{
        dispatch({
            type: LOAD_FOLLOWERS_REQUEST,
            offset: followerList.length,
        })
    }, [])

    return (
        <>
            <NicknameEditForm />
            <List 
                style={{ marginBottom: '20px'}}
                grid={{ gutter: 4, xs: 2, md: 3}}
                size="small"
                header={<div>팔로잉목록</div>}
                loadMore={ hasMoreFollowing && <Button style={{ width: "100%" }} onClick={loadMoreFollowings}>더보기</Button>}
                bordered
                dataSource={followingList}
                renderItem={item => (
                    <List.Item style={{ marginTop: '20px'}}>
                        <Card actions={[<Icon key="stop" type="stop" onClick={onUnfollow(item.id)} />]}>
                            <Card.Meta description={item.nickname} />
                        </Card>
                    </List.Item>
                )}
            />
            <List 
                style={{ marginBottom: '20px'}}
                grid={{ gutter: 4, xs: 2, md: 3}}
                size="small"
                header={<div>팔로워목록</div>}
                loadMore={ hasMoreFollower && <Button style={{ width: "100%" }} onClick={loadMoreFollowers} >더보기</Button>}
                bordered
                dataSource={followerList}
                renderItem={item => (
                    <List.Item style={{ marginTop: '20px'}}>
                        <Card actions={[<Icon key="stop" type="stop" onClick={onRemoveFollwer(item.id)} />]}>
                            <Card.Meta description={item.nickname} />
                        </Card>
                    </List.Item>
                )}
            />
            <div>
                {mainPosts.map(c => (
                    <PostCard key={+c.createdAt} post={c} />
                ))}
            </div>
        </>
    );
};

Profile.getInitialProps = async ( context ) => {
    const state = context.store.getState()
    // 이 전에 LOAD_USERS_REQUEST
    context.store.dispatch({
        type: LOAD_FOLLOWERS_REQUEST,
        data: state.user.me && state.user.me.id,
    })
    context.store.dispatch({
        type: LOAD_FOLLOWINGS_REQUEST,
        data: state.user.me && state.user.me.id,
    })
    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: state.user.me && state.user.me.id,
    })
    // 이 쯤 LOAD_USER_SUCCESS => me가 늦게 생겨서 앞에서 불러올 정보 불러오지 못함
}

export default Profile