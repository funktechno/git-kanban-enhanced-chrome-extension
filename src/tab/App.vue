<template>
  <div>
    <div v-if="currentOptions && currentOptions.length > 0">
      <h3>Remote Git Server:</h3>
      <ul id="git-hosts">
        <li v-if="!currentOptions || !currentOptions.length > 0">
          Example - try.gitea.io : gitea.io <button>Remove</button>
        </li>
        <li
          v-for="(opt, index) in currentOptions"
          v-bind:key="opt.url"
          v-on:click="selectedIndex = index"
        >
          <strong v-if="index == selectedIndex">Selected - </strong>
          {{ opt.url }} <span v-if="opt.type">: {{ opt.type }}</span>
          <button v-on:click="deleteOption(index)">Remove</button>
        </li>
      </ul>
      <div v-if="selectedIndex != null">
        <h3>{{ currentOptions[selectedIndex].url }} Details</h3>

        <h3>Labels:</h3>

        <h3>
          Oauth:
          <span v-if="currentOptions[selectedIndex].oToken">-Provided-</span>
        </h3>

        <h3>Add Oauth Token:</h3>
        <label>token: </label>
        <input v-model="oToken" placeholder="github.example.com" />
        <br />
        <button id="save" v-on:click="addToken">Add</button>
      </div>
    </div>
    <p></p>
    <div class="custom-options" style="display: none">
      <h3>Add a custom git platform:</h3>
      <label>Url Host: </label>
      <input id="gitHost" v-model="url" placeholder="github.example.com" />
      <br />
      <label>Git Host Type: </label>
      <select id="gitType" v-model="type">
        <option value="github.com">github.com (Not Yet Supported)</option>
        <option value="bitbucket.org">bitbucket.org (Not Yet Supported)</option>
        <option value="gitlab.com">gitlab.com (Not Yet Supported)</option>
        <option value="gitea.io">gitea.com (kanban works)</option>
      </select>
      <button id="save" v-on:click="saveOptions">Add</button>
    </div>
    <!-- end option add -->

    <div id="status"></div>

    <div>
      <h3>Kanban Labels:</h3>
      <ul>
        <li>backlog</li>
        <li>analysis</li>
        <li>in-progress</li>
        <li>testing</li>
        <li>closed</li>
      </ul>
    </div>
    <div id="export">
      <h2>Export/Import</h2>
      <label></label>
      <textarea v-model="importJson"></textarea>
      <br />
      <button v-on:click="importOptions">Import</button>
      <button v-on:click="exportOptions">Export</button>
    </div>
  </div>
  <!-- div Git Kanban Options
    div {{test}} -->
</template>
<script lang="ts">
import Vue from "vue";

// import constants from '../js/constants'
import { optionsKey } from "@/utils/constants";

export default Vue.extend({
  data: () => ({
    type: (null as unknown) as string,
    url: (null as unknown) as string,
    loading: false,
    currentOptions: (null as unknown) as any[],
    importJson: (null as unknown) as string,
    selectedIndex: (null as unknown) as number | null,
    oToken: (null as unknown) as string | null,
  }),
  // computed: {},
  // created() {},
  mounted() {
    // console.log(optionsKey)
    // function restoreOptions () {
    // }
    // this.updateLiOptions()
    this.retrieveManifest();
    // restoreOptions()
  },
  methods: {
    retrieveManifest: function () {
      // console.log(this.retrieveManifest.name)
      const vm = this;

      this.loading = true;
      // this.updateLiOptions()
      this.$http.get("/manifest.json").then((response: any) => {
        // this.updateLiOptions()
        this.loading = false;
        // response = JSON.parse(this.responseText)
        if (response.body.name.indexOf("Self Hosted") !== -1) {
          // unhide urls
          const myClasses = document.querySelectorAll(".custom-options"),
            l = myClasses.length;
          let i = 0;

          for (i; i < l; i++) {
            if (myClasses[i]) (myClasses[i] as HTMLElement).style.display = "";
          }
        }
        // restore urls
        chrome.storage.sync.get([optionsKey], function (result) {
          // console.log(result)
          if (result && result[optionsKey] && result[optionsKey].length) {
            vm.currentOptions = result[optionsKey];
          } else {
            vm.currentOptions = [];
          }
          // document.getElementById('color').value = items.favoriteColor;
          // document.getElementById('like').checked = items.likesColor;
        });
        // response = response
      });
    }, // end retrieve manifest
    importOptions() {
      let response = null;
      if (!this.importJson) {
        console.warn("no import json");
        return;
      }
      try {
        response = JSON.parse(this.importJson);
      } catch (error) {
        console.warn("invalid json");
      }

      if (!response) {
        console.warn("failed to get response");
        return;
      }
      console.log(response);
      // prompt with warning
      chrome.storage.sync.set(
        {
          [optionsKey]: response,
        },
        function () {
          //
        }
      );
      this.currentOptions = response;
    },
    exportOptions() {
      console.log(this.exportOptions.name);
      if (!this.currentOptions) {
        console.warn("no export json");
        return;
      }
      const data = JSON.stringify(this.currentOptions);
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = "git-kanban-export.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent("click", true, false);
      a.dispatchEvent(e);
    },
    addToken: function () {
      if (!this.oToken) {
        console.warn("missing oToken");
        return;
      }
      if (this.selectedIndex) {
        this.currentOptions[this.selectedIndex].oToken = this.oToken;

        chrome.storage.sync.set(
          {
            [optionsKey]: this.currentOptions,
          },
          function () {
            //
          }
        );

        this.oToken = null;
      }
    },
    saveOptions: function () {
      console.log("saving options");
      const type = this.type,
        url = this.url;

      if (!type || !url) {
        console.warn("missing url or type");
        return;
      }

      if (!this.currentOptions || !this.currentOptions.length) {
        this.currentOptions = [];
      }

      this.currentOptions.push({ type, url });

      chrome.storage.sync.set(
        {
          [optionsKey]: this.currentOptions,
        },
        function () {
          //
        }
      );
    },
    deleteOption: function (e: number) {
      // console.log(e)
      // remove from local object
      this.currentOptions.splice(e, 1);
      // console.log(this.currentOptions)
      // update storage
      // update li
      chrome.storage.sync.set(
        {
          [optionsKey]: this.currentOptions,
        },
        function () {
          //
        }
      );
      if (e === this.selectedIndex) {
        this.selectedIndex = null;
      } else if (this.selectedIndex) {
        this.selectedIndex--;
      }
    },
  },
});
</script>

<style>
div {
  color: blue;
}
#export textarea {
  width: 80%;
  max-width: 95%;
  min-height: 75px;
}
</style>
