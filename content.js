function removeAds(doc) {
  const banner = doc.querySelector('.sc-dYdBQb');
  if (banner) {
    banner.remove();
  }
}

(function (doc, found) {
  const windowListener = function () {
    const contentElement = document.getElementsByClassName('sc-ihsSHl')[0];
    if (found && !contentElement) {
      found = false;
    }

    if (contentElement) {
      found = true;
      window.removeEventListener('DOMSubtreeModified', windowListener);
      enableListener(contentElement);
      removeAds(doc);
    }
  };
  window.addEventListener('DOMSubtreeModified', windowListener, false);
})(document, false);

function enableListener(contentElement) {
  function findUsername(mutation) {
    if (mutation.target) {
      if (mutation.addedNodes[0] &&
        mutation.addedNodes[0].classList && mutation.addedNodes[0].classList.contains('sc-iJuUWI')) {
        const username = mutation.addedNodes[0].querySelector('.sc-bdfBwQ');
        return String(username.innerHTML);
      }
    }

    return '';
  }

  async function filterPost(mutation) {
    const username = findUsername(mutation);
    if (username) {
      const banned = await UserService.getUsers();
      const lower = banned.map((element) => element.toLowerCase());
      if (lower.includes(username.toLowerCase())) {
        mutation.addedNodes[0].classList.add('hidden');
      }
    }
  }

  const mutationObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      filterPost(mutation);
    });
  });

  mutationObserver.observe(contentElement, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
  });
}

const refresh = async () => {
  const banned = await UserService.getUsers();
  const lower = banned.map((element) => element.toLowerCase());
  const posts = document.getElementsByClassName('sc-iJuUWI');
  for (let element of posts) {
    const username = element.querySelector('.sc-bdfBwQ').innerText.toLowerCase();
    if (lower.includes(username)) {
      element.classList.add('hidden');
    } else {
      element.classList.remove('hidden');
    }
  }
}

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.message === 'refresh') {
      refresh();
    }
  }
);

setTimeout(() => refresh(), 1000);