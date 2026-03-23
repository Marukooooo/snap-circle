"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Search, Loader2, User, FileText } from "lucide-react";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

export default function NavbarSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ users: any[]; posts: any[] }>({
    users: [],
    posts: [],
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. 异步搜索请求
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults({ users: [], posts: [] });
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
        );
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  // 3. 核心跳转清理函数
  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery("");
    setResults({ users: [], posts: [] });
    router.push(url);
  };

  // 4. 处理回车直接搜索
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      handleSelect(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-4" ref={containerRef}>
      {/* 搜索输入框容器 */}
      <div className="flex items-center bg-secondary/50 rounded-full px-4 py-1.5 border border-transparent focus-within:border-primary/30 focus-within:bg-background transition-all shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="搜索用户名或帖子..."
          className="flex-1 bg-transparent border-none outline-none p-2 text-sm placeholder:text-muted-foreground"
        />
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin text-primary/70 shrink-0" />
        )}
      </div>

      {/* 下拉结果浮层 */}
      {open && query.length >= 2 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-popover border rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <Command shouldFilter={false}>
            <CommandList className="max-h-[min(400px,70vh)] p-2">
              {/* 空状态处理 */}
              {results.users.length === 0 &&
                results.posts.length === 0 &&
                !loading && (
                  <div className="py-10 text-center">
                    <p className="text-sm text-muted-foreground">
                      未找到关于 "{query}" 的结果
                    </p>
                  </div>
                )}

              {/* 用户结果组 */}
              {results.users.length > 0 && (
                <CommandGroup
                  heading={
                    <span className="px-2 text-xs font-semibold text-muted-foreground">
                      用户
                    </span>
                  }
                >
                  {results.users.map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => handleSelect(`/profile/${user.username}`)}
                      className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-accent transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 border">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">
                          @{user.username}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                          点击查看个人主页
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* 帖子结果组 */}
              {results.posts.length > 0 && (
                <CommandGroup
                  heading={
                    <span className="px-2 text-xs font-semibold text-muted-foreground mt-2">
                      帖子
                    </span>
                  }
                >
                  {results.posts.map((post) => (
                    <CommandItem
                      key={post.id}
                      onSelect={() => handleSelect(`/post/${post.id}`)}
                      className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-accent transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border">
                        {post.img ? (
                          <img
                            src={post.img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <span className="text-sm text-foreground line-clamp-2 leading-snug">
                        {post.desc}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
