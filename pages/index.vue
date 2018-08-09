<template>
	<div class="wrap">
		<el-container>

			<el-main>
				<el-steps :active="active" finish-status="success" v-if="isFBReady">
					<el-step title="登入並授權"></el-step>
					<el-step title="取得粉絲頁列表"></el-step>
					<el-step title="選擇粉絲頁"></el-step>
					<el-step title="選擇文章"></el-step>
					<el-step title="對留言進行回覆"></el-step>
				</el-steps>

				<br>

				<br>
				<br>
				<!-- <el-button style="margin: 12px;" @click="handleNextStep">下一步</el-button> -->
				<el-row>
					<el-col :span="8">
						<el-card class="box-card">
							<div slot="header" class="clearfix">
								<h1>Facebook SDK :
									<i :class="isFBReady?'el-icon-success':'el-icon-error'"></i>
								</h1>
							</div>
							<div v-for="(value, key, index) in dataFB" :key="index" class="text item">
								<p>{{ key }}：　{{value}}</p>

							</div>
						</el-card>
					</el-col>
					<el-col :span="16">
						<template v-if="active==0 && isFBReady">
							<h1>【Step 1】登入並授權</h1>
							<br>
							<el-button type="primary" @click="clickLogin">登入</el-button>
						</template>
						<template v-if="active==1">
							<h1>【Step 2】取得粉絲列表</h1>
							<br>
							<el-button type="primary" @click="clickMeAccount">取得粉絲專頁列表</el-button>

						</template>
						<template v-if="active==2">
							<h1>【Step 3】選擇粉絲頁</h1>
							<br>
							<el-table :data="listAccount" empty-text="No Data" highlight-current-row @current-change="handleAccountCurrentChange" style="width: 500px">
								<el-table-column prop="id" label="ID" width="250">
								</el-table-column>
								<el-table-column prop="name" label="名稱" width="250">
								</el-table-column>
							</el-table>
							<el-button style="margin: 12px;" v-if="AccountCurrentRow!==null" @click="handleNextStep">下一步</el-button>
						</template>
						<template v-if="active==3">
							<h1>【Step 4】選擇文章</h1>
							<br>
							<el-table :data="listPosts" empty-text="No Data" highlight-current-row @current-change="handlePostsCurrentChange" style="width: 510px">
								<el-table-column prop="created_time" label="建立時間" width="150">
								</el-table-column>
								<el-table-column prop="id" label="ID" width="160">
								</el-table-column>

								<el-table-column prop="message" label="訊息" width="200">
								</el-table-column>
							</el-table>
							<el-button style="margin: 12px;" v-if="PostsCurrentRow!==null" @click="handleNextStep">下一步</el-button>
						</template>
						<template v-if="active==4">
							<h1>【Step 5】對留言進行回覆</h1>
							<br>

							<el-table :data="listComments" empty-text="No Data" highlight-current-row @current-change="handleCommentsCurrentChange" style="width: 660px">
								<el-table-column prop="created_time" label="建立時間" width="150">
								</el-table-column>
								<el-table-column prop="id" label="ID" width="160">
								</el-table-column>
								<el-table-column prop="from.name" label="名稱" width="150">
								</el-table-column>
								<el-table-column prop="message" label="訊息" width="200">
								</el-table-column>
							</el-table>
							<div style="margin: 20px;">

							</div>
							<el-form ref="form" label-width="80px" v-if="CommentsCurrentRow!==null">
								<el-form-item label="類型">
									<el-col :span="11">
										<el-radio v-model="radioComment" label="comments" border>Comments</el-radio>
										<el-radio v-model="radioComment" label="private_replies" border>Private Replies</el-radio>
									</el-col>

								</el-form-item>

								<el-form-item label="訊息">
									<el-input type="text" v-model="inputMessage"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button type="success" @click.prevent="postReply" v-if="!(inputMessage.length<=0)" :loading="statusReply">傳送</el-button>
								</el-form-item>
							</el-form>
							<!-- <el-button style="margin: 12px;" v-if="CommentsCurrentRow!==null" @click="handleNextStep">下一步</el-button> -->
						</template>
					</el-col>
				</el-row>

			</el-main>
		</el-container>
	</div>

</template>

<script>
import AppLogo from '~/components/AppLogo.vue';
import Vue from 'vue';
export default {
	components: {
		AppLogo,
	},
	data: function() {
		return {
			isFBReady: false,
			active: 0,
			dataFB: {},
			listAccount: [],
			listPosts: [],
			listComments: [],
			AccountCurrentRow: null,
			PostsCurrentRow: null,
			CommentsCurrentRow: null,
			radioComment: 'comments',
			inputMessage: '',
			statusReply: false,
		};
	},
	created() {},

	beforeDestroy: function() {
		window.removeEventListener('fb-sdk-ready', this.onFBReady);
	},
	methods: {
		onFBReady: function() {
			this.isFBReady = true;
		},
		handleNextStep() {
			// this.active++
			if (this.active++ > 10) this.active = 0;
		},
		clickLogin() {
			this.FB.login(
				response => {
					if (response.status == undefined) {
						this.$message({
							message: '沒有成功登入',
							type: 'error',
						});
						return;
					}
					// Vue.set(
					// 	this.dataFB,
					// 	'User AccessToken',
					// 	response.authResponse.accessToken
					// );
					this.FB.api('/me', response => {
						Vue.set(this.dataFB, 'User', response.name);
						Vue.set(this.dataFB, 'ID', response.id);
						this.handleNextStep();
					});
				},
				{
					scope:
						'manage_pages,publish_pages,read_page_mailboxes,pages_show_list',
				}
			);
		},
		clickMeAccount() {
			this.FB.api('/me/accounts', response => {
				this.listAccount = response.data;
				this.handleNextStep();
			});
		},
		handleAccountCurrentChange(val) {
			this.AccountCurrentRow = val;
			Vue.set(this.dataFB, 'PageAccessToken', val.access_token);
			if (val !== null) Vue.set(this.dataFB, 'PageID', val.id);
			this.getPostsList();
		},
		getPostsList() {
			this.FB.api('/' + this.dataFB.PageID + '/posts', res => {
				this.listPosts = res.data;
			});
		},
		handlePostsCurrentChange(val) {
			this.PostsCurrentRow = val;
			if (val !== null) {
				Vue.set(this.dataFB, 'PostID', val.id);
				this.getCommentsList();
			}
		},
		getCommentsList() {
			// this.FB.api('/' + this.dataFB.PostID + '/comments?fields='+this.dataFB.PageAccessToken, res => {
			//   console.log(res);
			// });

			$.ajax({
				url: `https://graph.facebook.com/v3.1/${
					this.dataFB.PostID
				}/comments`,
				data: {
					access_token: this.dataFB.PageAccessToken,
				},
				type: 'get',

				success: res => {
					console.log(res.data);
					this.listComments = res.data;
				},
			});
		},
		handleCommentsCurrentChange(val) {
			this.CommentsCurrentRow = val;
			if (val !== null) Vue.set(this.dataFB, 'CommentID', val.id);
		},
		postReply() {
			console.log(this.dataFB.CommentID);
			this.statusReply = true;
			$.ajax({
				url: `https://graph.facebook.com/v3.1/${
					this.dataFB.CommentID
				}/${this.radioComment}`,
				data: $.param({
					access_token: this.dataFB.PageAccessToken,
					message: this.inputMessage,
				}),
				type: 'post',

				success: res => {
					console.log(res);
					this.$message({
						message:
							this.radioComment === 'private_replies'
								? '留言私訊成功！'
								: '留言回覆成功！',
						type: 'success',
					});
					this.statusReply = false;
				},
				error: res => {
					if (this.radioComment === 'private_replies') {
						this.$message({
							message: '對不起, 一篇留言只能私訊一次',
							type: 'error',
						});
						this.statusReply = false;
						return;
					}
					this.$message({
						message: '有地方出錯了',
						type: 'error',
					});
					this.statusReply = false;
				},
			});
		},
	},
	mounted: function() {
		this.isFBReady = this.FB != undefined;
		window.addEventListener('fb-sdk-ready', this.onFBReady);
	},
};
</script>

<style >
.wrap {
	width: 100%;
	max-width: 1170px;
	margin: 0 auto;
}
p {
	word-wrap: break-word;
}
.el-header {
	background-color: #b3c0d1;
	color: #333;
	/* text-align: center; */
}

.el-main {
	background-color: #e9eef3;
	color: #333;
}

.el-container {
	height: 100vh;
}
.text {
	font-size: 14px;
}
.el-input {
	width: 300px;
}

.item {
	margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: '';
}
.clearfix:after {
	clear: both;
}

.box-card {
	width: 360px;
}
tbody {
	cursor: pointer;
}
.el-table__body tr.current-row > td {
	background-color: #cde2c3;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
	background-color: #cde2c3;
}
</style>

