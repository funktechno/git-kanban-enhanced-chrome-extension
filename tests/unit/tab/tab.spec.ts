import { shallowMount } from "@vue/test-utils";
import App from "@/tab/App.vue";
import { chrome } from "jest-chrome";
import { optionsKey } from "@/utils/constants";

describe("tab/tab", () => {
  it("renders tab/App.vue", async () => {
    const msg =
      "Add a custom git platform: Url Host:    Git Host Type:  github.com (Not Yet Supported) bitbucket.org (Not Yet Supported) gitlab.com (Not Yet Supported) gitea.com (kanban works) Add  Kanban Labels: backlog analysis in-progress testing closed Export/Import    Import Export";
    const responseDefault = Promise.resolve({
      status: 200,
      data: {},
      body: {
        name: "Self Hosted Kanban",
      },
    });

    // const listenerSpy = jest.fn()
    const sendResponseSpy = jest.fn();

    chrome.storage.sync.get(
      [optionsKey],
      sendResponseSpy // SendResponse function
    );
    const wrapper = shallowMount(App, {
      mocks: {
        $http: {
          get: (url: string) => {
            if (url) return responseDefault;
            // if (url == "/api/accounts/asset") return responseAccounts;
          },
        },
      },
      // propsData: { msg },
    });
    await wrapper.vm.$nextTick();
    await responseDefault.then();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toMatch(msg);
    expect(sendResponseSpy).not.toBeCalled();
  });
});
